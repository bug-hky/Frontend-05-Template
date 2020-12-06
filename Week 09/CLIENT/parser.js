/*
* HTML解析：----------------------------------------------------------------------
* 第一步-parse模块的拆分
*   1. parser单独拆成文件
*   2. parser接收HTML文本，返回DOM树
*
* 第二步-使用FSM-有限状态机来实现HTML的分析:
*   1. 使用FSM-有限状态机来实现HTML的分析
*   2. 在HTML标准里面，已经规定了HTML的状态
*   3. Toy-Browser只挑选其中一部分状态，完成一个最简版本
*
* 第三步-解析标签:
*   1. 主要的标签有: 开始标签, 结束标签，自封闭标签
*   2. 暂时忽略标签的attribute
*
* 第四步-创建元素:
*   1. 在状态机中，除了状态迁移，我们还要加入业务逻辑
*       (parser,js的业务逻辑: 创建token => 把字符加到token上 => emit token)
*   2. 标签结束状态提交标签token
*
* 第五步-处理属性:
*   1. 属性值分为单引号，双引号，无引号三种写法，因此需要较多的状态处理
*   2. 处理属性的方式和标签类似
*   3. 属性结束时，我们把属性加到标签Token上
*
* 语法分析：----------------------------------------------------------------------
*
* 第六步-token构建DOM树:（tree-construction的第一步）
*   1. 使用栈结构从标签构建浏览器的DOM树
*   2. 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
*   3. 子封闭节点可视为如战后立刻出栈
*   4. 任何元素的父元素是它入栈前的栈顶
*
* 第七步-文本节点追加到DOM树:（tree-construction的第二步）
*   1. 文本节点与自封闭标签处理标签
*   2. 多文本节点需要合并
*
* CSS Computing ----------------------------------------------------------------
*
* 第一步-遇到style标签，把CSS规则保存起来
*   1. 遇到style标签，把CSS规则保存起来
*   2. 调用CSS Parser 来分析CSS规则（需要仔细研究CSS AST 格式）
*
* 第二步-添加调用
*   1. 计算CSS时机是startTag时
*   2. 当创建一个元素后，立即计算CSS
*   3. 理论上，当我们分析一个元素时，所有的CSS规则已经收集完毕，但在真实的浏览器中，可能遇到写在body的style标签，需要重新CSS计算的情况，这里我们忽略
*
* 第三步-获取父元素序列
*   1. 在ComputeCSS函数中，我们必须知道元素的所有父元素才能判断元素与规则是否匹配
*   2. 我们从上一个步骤的stack，可以获取本元素的所有父元素
*   3. 首先获取的是当前元素，所以计算与父元素相匹配的顺序是从内向外的
*
* 第四步-选择器与元素匹配
*   1. 选择器也要由当前元素从内向外排列
*   2. 复杂选择器拆成单个元素的选择器，用循环匹匹厄父元素队列
*
* 第五步-计算选择器与元素匹配
*   1. 根据选择器的类型和元素属性，计算是否与当前元素匹配
*   2. 实际浏览器重要处理复合选择器（实现复合选择器，实现支持空格的class选择器）
*
* 第六步-生成computed属性
*   1. 一旦选择器匹配上，就应用选择器到元素上，形成computedStyle
*
* 第七步-specificity的计算逻辑
*   1. CSS规则根据specificity和后来优先规则覆盖
*   2. specificity是个四元组，越左权重越高
*   3. 一个CSS规则的specificity根据包含的简单选择器相加而成
*
*  */

const CSS = require('css')
const EOF = Symbol('EOF') // End Of File
const SPACE_ERG = /^[\t\n\f ]$/

// 全局变量， 在HTML中TAG不管多复杂，都是当作一个token去处理的
let currentToken = null
let currentAttribute = null
let currentTextNode = null


let stack = [{type: 'document', children: []}]

// add new method: addCSSRules, css规则暂存在一个数组中
let rules = []

function addCSSRules (cssText) {
    var ast = CSS.parse(cssText)
    console.info('css ast', JSON.stringify(ast, null, '    '))
    rules.push(...ast.styleSheet.rules)
}

function match (element, selector) {
    // 若没有选择器或者是文本节点
    if (!selector || !element.attribute) return false
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
        if (part.chatAt(0) === '#') {
            p[1] += 1
        } else if (part.chatAt(0) === '#') {
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

        if (j >= selectorParts.length) matched = true

        if (matched) {
            console.info('Element', element, 'matched rule', rule)
            // 第六步代码
            // var computedStyle = element.computedStyle
            // for (var declaration of rule.declarations) {
            //     if (!computedStyle[declaration.property])
            //         computedStyle[declaration.property] = {}
            //     computedStyle[declaration.property].value = declaration.value
            // }
            // console.info('element.computedStyle', element.computedStyle)

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
    console.info(token)
    // if (token.type === 'text') return
    let top = stack[stack.length - 1]
    if (token.type === 'startTag') {
        // 写在html文本里面的带尖括号的叫tag，它背后表示的就是element，所以document对象里面只会有node和element不会有tag
        let element = {
            type: 'element',
            children: [],
            attribute: []
        }

        element.tagName = token.tagName

        for (let p in token) {
            if (p !== 'type' && p !== 'tagName') {
                element.attribute.push({
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
        return data
    } else {
        return tagName
    }
}

function beforeAttributeName (c) {
    if (c.match(SPACE_ERG)) {
        return beforeAttributeName
    } else if (c ==='/' || c === '>' || c === EOF) {
        return afterAttributeName
    } else if (c === '=') {
        // return error
    } else {
        currentAttribute = {
            type: '',
            value: ''
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
        return data
    } else if (c === 'EOF') {
    } else {
    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.info(html)
    let state = data
    for (let c of html) {
        state = state(c)
    }
    state = state(EOF)
}