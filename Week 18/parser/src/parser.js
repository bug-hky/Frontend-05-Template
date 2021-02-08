const CSS = require('css')
const EOF = Symbol('EOF') // End Of File
const SPACE_ERG = /^[\t\n\f ]$/
const layout = require('./layout')

// 全局变量， 在HTML中TAG不管多复杂，都是当作一个token去处理的
let currentToken = null
let currentAttribute = null
let currentTextNode = null


let stack = [{type: 'document', children: []}]

// add new method: addCSSRules, css规则暂存在一个数组中
let rules = []

function addCSSRules (cssText) {
    var ast = CSS.parse(cssText)
    // console.info('css ast: ', typeof ast, ast.type)
    rules.push(...ast.stylesheet.rules)
}

function match (element, selector) {
    // 若没有选择器或者是文本节点
    if (!selector || !element.attributes) return false
    var attr = null
    if (selector.charAt(0) === '#') {
        attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) return true
    } else if (selector.charAt(0) === '.') {
        attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) return true
    } else {
        if (element.tagName === selector) return true
    }
    return false
}

function specificity (selector) {
    var p = Array(4).fill(0)
    var selectorParts = selector.split(' ')
    for (var part of selectorParts) {
        if (part.charAt(0) === '#') {
            p[1] += 1
        } else if (part.charAt(0) === '.') {
            p[2] += 1
        } else {
            p[3] += 1
        }
    }
    return p
}

function compare (sp1, sp2) {
    if (sp1[0] - sp2[0])
        return sp1[0] - sp2[0]
    if (sp1[1] - sp2[1])
        return sp1[1] - sp2[1]
    if (sp1[2] - sp2[2])
        return sp1[2] - sp2[2]
    return sp1[3] - sp2[3]
}

function computeCSS (element) {
    console.info(element)
    console.info('Compute CSS for Element', element)
    // 获取父元素序列
    var elements = stack.slice().reverse()
    if (!element.computedStyle)
        element.computedStyle = {}

    for (let rule of rules) {
        var selectorParts = rule.selectors[0].split(' ').reverse()

        if (!match(element, selectorParts[0]))
            continue

        var j = 1
        for (var i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++
            }
        }

        if (j >= selectorParts.length) {
            console.info('Element', element, 'matched rule', rule)

            var sp = specificity(rule.selectors[0])
            var computedStyle = element.computedStyle
            for (var declaration of rule.declarations) {
                if (!computedStyle[declaration.property])
                    computedStyle[declaration.property] = {}
                if (!computedStyle[declaration.property].specificity) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
                    computedStyle[declaration.property].value = declaration.value
                    computedStyle[declaration.property].specificity = sp
                }
            }
        }

    }
}

function emit (token) {
    // console.info(token)
    // if (token.type === 'text') return
    let top = stack[stack.length - 1]
    if (token.type === 'startTag') {
        // 写在html文本里面的带尖括号的叫tag，它背后表示的就是element，所以document对象里面只会有node和element不会有tag
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }

        element.tagName = token.tagName

        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        computeCSS(element)

        top.children.push(element)
        element.parent = top
        if (!token.isSelfClosing)
            stack.push(element)
        currentTextNode = null
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error('tag start end doesn`t match')
        } else {
            // 遇到style标签时，执行添加css规则的操作
            if (top.tagName === 'style') {
                addCSSRules(top.children[0].content)
            }
            // 排版发生在标签的结束标签之前
            layout(top)
            stack.pop()
        }
        currentTextNode = null
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

function data (c) {
    if (c === '<') {
        return tagOpen
    } else if (c === EOF) {
        emit({
            type: 'EOF'
        })
        return
    } else {
        emit({
            type: 'text',
            content: c
        })
        return data
    }
}

function tagOpen(c) {
    if (c === '/') {
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'startTag',
            tagName: ''
        }
        return tagName(c)
    } else {
        // 标签以特殊字符开头
        return
    }
}

function endTagOpen (c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(c)
    } else if (c === '>') {
        emit(currentToken)
    } else if (c === EOF) {
    } else {
    }
}

function tagName(c) {
    if (c.match(SPACE_ERG)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += c//.toLowerCase()
        return tagName
    } else if (c === '>') {
        emit(currentToken)
        return data
    } else {
        // 标签名称里面包含特殊字符才会触发这个else
        currentToken.tagName += c
        return tagName
    }
}

function beforeAttributeName (c) {
    if (c.match(SPACE_ERG)) {
        return beforeAttributeName
    } else if (c ==='/' || c === '>' || c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        // return error
    } else {
        currentAttribute = {
            type: '',
            value: '',
            name: ''
        }
        return attributeName(c)
    }
}

function attributeName (c) {
    if (c.match(SPACE_ERG) || c === '>'|| c === '/'|| c === EOF) {
        return afterAttributeName(c)
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '\u0000') {
    } else if (c === "\'" || c === "'" || c === '<') {
    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue (c) {
    if (c.match(SPACE_ERG) || c === '>'|| c === '/'|| c === EOF) {
        return beforeAttributeValue
    } else if (c === "\"") {
        return doubleQuotedAttributeValue
    } else if (c === "\'") {
        return singleQuotedAttributeValue
    } else if (c === '>') {
        // return data
    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue (c) {
    if (c === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}
function singleQuotedAttributeValue (c) {
    if (c === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c === '\u0000') {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue (c) {
    if (c.match(SPACE_ERG)) {
        return beforeAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}

function UnquotedAttributeValue (c) {
    if (c.match(SPACE_ERG)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === '\u0000') {
    } else if (c === "\"" || c === "'" || c === "<" || c === "=" || c === "`") {
    } else if (c === EOF) {
    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}
function afterAttributeName (c) {
    if (c.match(SPACE_ERG)) {
        return afterAttributeName
    } else if (c === '/') {
        return selfClosingStartTag
    } else if (c === '=') {
        return beforeAttributeValue
    } else if (c === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c === EOF) {
    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function selfClosingStartTag (c) {
    if (c === '>') {
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    }
}

// module.exports.parseHTML = function parseHTML(html) {
export function parseHTML (html) {
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)
    return stack[0]
}

// let htmlText = `<html>
// <head>
//   <title>vue-g</title>
//   <style>
//     .test-link {
//         color: red;
//         font-size: 20px;
//     }
//   </style>
// </head>
// <body>
//   <div%
//     data-range
//     isError='false'
//     id="app"
//     class="test-link"
//   >
//   </div%>
//   <br/>
//   <img src="https://zh.wikipedia.org/wiki/File:Andy_Lau_(cropped).jpg" />
// </body>
// </html>`

// let res = parseHTML(htmlText)

// console.info('cur-page', res)
