// for (let i of [0, 1, 2]) {
//     console.info(i)
// }

// 1-7号 不看笔记把这个JSX组件化基本用法重新手写一遍
function createElement (type, attributes, ...children) {
    // let element = document.createElement(type)
    let element
    if (typeof type === 'string')
        // element = document.createElement(type)
        element = new ElementWrap(type)
    else
        element = new type

    for (let attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
    }
    for (let child of children) {
        if (typeof child === 'string') {
            // child = document.createTextNode(child)
            child = new TextWrap(child)
        }
        element.appendChild(child)
    }
    return element
}

class ElementWrap {
    constructor (type) {
        this.root = document.createElement(type)
    }
    setAttribute (name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild (child) {
        // this.root.appendChild(child)
        child.mountTo(this.root)
    }
    mountTo (parent) {
        parent.appendChild(this.root)
    }
}

class TextWrap {
    constructor (content) {
        this.root = document.createTextNode(content)
    }
    // 文本节点是没有setAttribute和appendChild方法的
    mountTo (parent) {
        parent.appendChild(this.root)
    }
}

class MyComponent {
    constructor () {
        this.root = document.createElement('div')
    }
    setAttribute (name, value) {
        this.root.setAttribute(name, value)
    }
    appendChild (child) {
        // this.root.appendChild(child)
        child.mountTo(this.root)
    }
    mountTo (parent) {
        parent.appendChild(this.root)
    }
}


let b = <div id="123">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            565675675
            <MyComponent id="456">
                <span>4</span>
                <span>5</span>
                <span>6</span>
                989989898
            </MyComponent>
        </div>
        
b.mountTo(document.body)

// console.info(a)
// var a = createElement("div", {
//     id: "123"
//   },
//   createElement("span", null),
//   createElement("span", null),
//   createElement("span", null)
// );