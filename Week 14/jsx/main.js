// for (let i of [0, 1, 2]) {
//     console.info(i)
// }

// 1-7号 不看笔记把这个JSX组件化基本用法重新手写一遍
function createElement (type, attributes, ...children) {
    let element = document.createElement(type)
    // let element
    // if (typeof type === 'string')
    //     element = document.createElement(type)
    // else
    //     element = new type

    for (let attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
    }
    for (child of children) {
        if (typeof child === 'string') {
            child = document.createTextNode(child)
        }
        element.appendChild(child)
    }
    return element
}

let a = <div id="123">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        565675675
    </div>


document.body.appendChild(a)

// console.info(a)
// var a = createElement("div", {
//     id: "123"
//   },
//   createElement("span", null),
//   createElement("span", null),
//   createElement("span", null)
// );