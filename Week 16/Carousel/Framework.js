export function createElement (type, attributes, ...children) {
    let element
    if (typeof type === 'string')
        element = new ElementWrap(type)
    else
        element = new type

    for (let attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
    }


    let processChildren = (children) => {
        for (let child of children) {
            if (Array.isArray(child)) {
                processChildren(child)
                continue
            }
            if (typeof child === 'string') {
                child = new TextWrap(child)
            }
            element.appendChild(child)
        }
    }
    processChildren(children)
    
    return element
}

export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

export class Component {
    constructor (type) {
        // this.root = this.render()
        this[ATTRIBUTE] = Object.create(null)
        this[STATE] = Object.create(null)
    }

    render () {
        return this.root
    }

    setAttribute (name, value) {
        this[ATTRIBUTE][name] = value
    }

    appendChild (child) {
        child.mountTo(this.root)
    }

    mountTo (parent) {
        if (!this.root) this.render()
        parent.appendChild(this.root)
    }
    // 触发
    triggerEvent (type, args) {
        this[ATTRIBUTE]['on' + type.replace(/^[\S\s]/, str => str.toUpperCase())](new CustomEvent(type, { detail: args }))
    }
}

class ElementWrap extends Component {
    constructor (type) {
        super()
        this.root = document.createElement(type)
    }

    setAttribute (name, value) {
        this.root.setAttribute(name, value)
    }
}

class TextWrap extends Component {
    constructor (content) {
        super()
        this.root = document.createTextNode(content)
    }
}