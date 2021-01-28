# 手势与动画的应用

## 将手势库&动画类 引入并改造轮播组件

```js
import { Component } from "./Framework";
import { enableGesture } from "./Gesture";
import { Timeline, Animation } from "./Animation";
import { ease } from "./Ease";

export class Carousel extends Component {
  constructor() {
    super();
    // super() 把render函数触发的时机往后移（到mountTo里面调用）
    this.attributes = Object.create(null);
  }
  // 重写setAttribute函数
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let path of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${path})`;
      this.root.appendChild(child);
    }

    // 为目标元素初始化手势类
    enableGesture(this.root);

    // 新建时间线 & 开始
    let timeLine = new Timeline();
    timeLine.start();

    let children = this.root.children;

    let position = 0;

    // PAN__________________________________________________
    this.root.addEventListener("pan", (event) => {
      console.info("pan", event.clientX);
      let x = event.clientX - event.startX;
      let current = position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = (pos + children.length) % children.length;

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    // PAN_END__________________________________________________
    this.root.addEventListener("panEnd", (event) => {
      console.info("panEnd", event.clientX);
      let x = event.clientX - event.startX;
      position = position - Math.round(x / 500);
      for (let offset of [
        0,
        -Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x)),
      ]) {
        let pos = position + offset;
        pos = (pos + children.length) % children.length;
        if (offset === 0) position = pos;
        children[pos].style.transition = "";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500
        }px)`;
      }
    });

    // AUTO-PLAY__________________________________________________
    setInterval(() => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;
      let current = children[position];
      let next = children[nextIndex];

      timeLine.add(
        new Animation(
          current.style, // element
          "transform", // property
          -position * 500, // start
          -500 - position * 500, // end
          500, // time
          0, // delay
          ease, // timingFunction
          (v) => `translateX(${v}px)` // template
        )
      );

      timeLine.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      position = nextIndex;
    }, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      .carousel {
        width: 500px;
        height: 280px;
        overflow: hidden;
        white-space: nowrap;
      }
      .carousel > div {
        width: 500px;
        height: 280px;
        display: inline-block;
        background-size: contain;
        /* 去掉CSS对Animation库的影响 ----------------------------------------------------*/
        /* transition: ease .5s; */
      }
    </style>
  </head>
  <body>
    <script src="./dist/main.js"></script>
  </body>
</html>
```

## 给手势库添加 start 事件派发 & start 事件触发动画即停止

```js
export class Recognize {
    constructor (dispatcher) {
        this.dispatcher = dispatcher
    }

    /**
     * 类似于系统中的全局事件会把正在进行的touch事件cancel掉，
     * 如下setTimeout代码执行的时候如果正在touchmove会触发
     * touchcancel事件监听
    */
    // setTimeout(() => window.alert('###'), 3000)
    start (point, context) {
        ...

        this.dispatcher.dispatch('start', {
            clientX: point.clientX,
            clientY: point.clientY
        })

        ...
    }
```

```js
...
render () {
        ...

        // 为目标元素初始化手势类
        enableGesture(this.root)

        // 新建时间线 & 开始
        let timeLine = new Timeline
        timeLine.start()


        let children = this.root.children

        let position = 0

        this.root.addEventListener('start', event => {
            timeLine.pause()
        })
...

```

## animation 的偏移量没有被计算进入拖拽的距离

```js
import { Component } from './Framework'
import { enableGesture } from './Gesture'
import { Timeline, Animation } from './Animation'
import { ease } from './Ease'

export class Carousel extends Component {
    ...

    render () {
        ...

        // 为目标元素初始化手势类
        enableGesture(this.root)

        // 新建时间线 & 开始
        let timeLine = new Timeline
        timeLine.start()


        let children = this.root.children

        let position = 0

        let t = 0

        let ax = 0

        let handler = null

        this.root.addEventListener('start', event => {
            timeLine.pause()
            clearInterval(handler)
            let progress = (Date.now() - t) / 1500
            ax = ease(progress) * 500 - 500
        })

        // PAN__________________________________________________
        this.root.addEventListener('pan', event => {
            ...
            let x = event.clientX - event.startX - ax
            ...
        })

        // PAN_END__________________________________________________
        this.root.addEventListener('panEnd', event => {
            ...
            let x = event.clientX - event.startX - ax
            ...
        })

        // AUTO-PLAY__________________________________________________
        let nextPicture = () => {
            ...
        }

        handler = setInterval(nextPicture, 3000)

        return this.root
    }
}
```

## 完善 panEnd 后的处理与 timeline 重启

```js
import { Component } from "./Framework";
import { enableGesture } from "./Gesture";
import { Timeline, Animation } from "./Animation";
import { ease } from "./Ease";

export class Carousel extends Component {
  constructor() {
    super();
    // super() 把render函数触发的时机往后移（到mountTo里面调用）
    this.attributes = Object.create(null);
  }
  // 重写setAttribute函数
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let path of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${path})`;
      this.root.appendChild(child);
    }

    // 为目标元素初始化手势类
    enableGesture(this.root);

    // 新建时间线 & 开始
    let timeLine = new Timeline();
    timeLine.start();

    let children = this.root.children;

    let position = 0;

    let t = 0;

    let ax = 0;

    let handler = null;

    this.root.addEventListener("start", (event) => {
      timeLine.pause();
      clearInterval(handler);
      let progress = (Date.now() - t) / 1500;
      ax = ease(progress) * 500 - 500;
    });

    // PAN__________________________________________________
    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    // PAN_END__________________________________________________
    this.root.addEventListener("panEnd", (event) => {
      timeLine.reset();
      timeLine.start();
      handler = setInterval(nextPicture, 3000);

      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % 500)) / 500;
      let direction = Math.round((x % 500) / 500);
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        timeLine.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            1500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      position = position - (x - (x % 500)) / 500 - direction;
      position =
        ((position % children.length) + children.length) % children.length;
    });

    // AUTO-PLAY__________________________________________________
    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;
      let current = children[position];
      let next = children[nextIndex];

      t = Date.now();

      timeLine.add(
        new Animation(
          current.style, // element
          "transform", // property
          -position * 500, // start
          -500 - position * 500, // end
          1500, // time
          0, // delay
          ease, // timingFunction
          (v) => `translateX(${v}px)` // template
        )
      );

      timeLine.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          1500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      position = nextIndex;
    };

    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
```

## 添加 flick 的逻辑

```js
import { Component } from "./Framework";
import { enableGesture } from "./Gesture";
import { Timeline, Animation } from "./Animation";
import { ease } from "./Ease";

export class Carousel extends Component {
  constructor() {
    super();
    // super() 把render函数触发的时机往后移（到mountTo里面调用）
    this.attributes = Object.create(null);
  }
  // 重写setAttribute函数
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let path of this.attributes.src) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${path})`;
      this.root.appendChild(child);
    }

    // 为目标元素初始化手势类
    enableGesture(this.root);

    // 新建时间线 & 开始
    let timeLine = new Timeline();
    timeLine.start();

    let children = this.root.children;

    let position = 0;

    let t = 0;

    let ax = 0;

    let handler = null;

    this.root.addEventListener("start", (event) => {
      timeLine.pause();
      clearInterval(handler);
      let progress = (Date.now() - t) / 500;
      ax = ease(progress) * 500 - 500;
    });

    // PAN__________________________________________________
    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    // PAN_END__________________________________________________
    this.root.addEventListener("end", (event) => {
      timeLine.reset();
      timeLine.start();
      handler = setInterval(nextPicture, 3000);

      let x = event.clientX - event.startX - ax;
      let current = position - (x - (x % 500)) / 500;
      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        if (event.velocity > 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        timeLine.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      position = position - (x - (x % 500)) / 500 - direction;
      position =
        ((position % children.length) + children.length) % children.length;
    });

    // AUTO-PLAY__________________________________________________
    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (position + 1) % children.length;
      let current = children[position];
      let next = children[nextIndex];

      t = Date.now();

      timeLine.add(
        new Animation(
          current.style, // element
          "transform", // property
          -position * 500, // start
          -500 - position * 500, // end
          500, // time
          0, // delay
          ease, // timingFunction
          (v) => `translateX(${v}px)` // template
        )
      );

      timeLine.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      position = nextIndex;
    };

    handler = setInterval(nextPicture, 3000);

    return this.root;
  }

  mountTo(parent) {
    parent.appendChild(this.render());
  }
}
```

## 抽象全局变量 & 状态属性

1. 把 Carousel 类里面的`this.attributes = Object.create(null)`移到 Component 类的 constructor 里面
2. 把 Carousel 类里面的 setAttribute 函数去掉，写入 Component 类
3. 把 Carousel 类里面的 mountTo 函数去掉，在 Component 类的 mountTo 函数里面加上判断

```js
export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === "string") element = new ElementWrap(type);
  else element = new type();

  for (let attrName in attributes) {
    element.setAttribute(attrName, attributes[attrName]);
  }

  for (let child of children) {
    if (typeof child === "string") {
      child = new TextWrap(child);
    }
    element.appendChild(child);
  }
  return element;
}

export class Component {
  constructor(type) {
    // 1
    this.attributes = Object.create(null);
  }
  // 2
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    // 3
    if (!this.root) this.render();
    parent.appendChild(this.root);
  }
}

class ElementWrap extends Component {
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextWrap extends Component {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}
```

4. 把 render 函数内部的一些变量 和 attributes 属性 Symbol 化挂载到 this 上

Framework.js

```js
export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === "string") element = new ElementWrap(type);
  else element = new type();

  for (let attrName in attributes) {
    element.setAttribute(attrName, attributes[attrName]);
  }

  for (let child of children) {
    if (typeof child === "string") {
      child = new TextWrap(child);
    }
    element.appendChild(child);
  }
  return element;
}

export const STATE = Symbol("state");
export const ATTRIBUTE = Symbol("attribute");

export class Component {
  constructor(type) {
    // this.root = this.render()
    this[ATTRIBUTE] = Object.create(null);
    this[STATE] = Object.create(null);
  }

  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value;
  }

  appendChild(child) {
    child.mountTo(this.root);
  }

  mountTo(parent) {
    if (!this.root) this.render();
    parent.appendChild(this.root);
  }
  // 触发
  triggerEvent(type, args) {
    this[ATTRIBUTE]["on" + type.replace(/^[\S\s]/, (str) => str.toUpperCase())](
      new CustomEvent(type, { detail: args })
    );
  }
}

class ElementWrap extends Component {
  constructor(type) {
    this.root = document.createElement(type);
  }
}

class TextWrap extends Component {
  constructor(content) {
    this.root = document.createTextNode(content);
  }
}
```

Carousel.js

```js
import { Component, STATE, ATTRIBUTE } from "./Framework";
import { enableGesture } from "./Gesture";
import { TimeLine, Animation } from "./Animation";
import { ease } from "./Ease";

export { STATE, ATTRIBUTE } from "./Framework";

export class Carousel extends Component {
  constructor() {
    super();
  }

  render() {
    this.root = document.createElement("div");
    this.root.classList.add("carousel");
    for (let item of this[ATTRIBUTE].data) {
      let child = document.createElement("div");
      child.style.backgroundImage = `url(${item.img})`;
      this.root.appendChild(child);
    }

    // 为目标元素初始化手势类
    enableGesture(this.root);

    // 新建时间线 & 开始
    this[STATE].timeLine = new TimeLine();
    this[STATE].timeLine.start();

    let children = this.root.children;

    this[STATE].position = 0;

    this[STATE].t = 0;

    this[STATE].ax = 0;

    this[STATE].handler = null;

    this.root.addEventListener("start", (event) => {
      this[STATE].timeLine.pause();
      clearInterval(this[STATE].handler);
      let progress = (Date.now() - this[STATE].t) / 500;
      this[STATE].ax = ease(progress) * 500 - 500;
    });

    this.root.addEventListener("tap", (event) => {
      this.triggerEvent("click", {
        data: this[ATTRIBUTE].data[this[STATE].position],
        position: this[STATE].position,
      });
    });

    // PAN__________________________________________________
    this.root.addEventListener("pan", (event) => {
      let x = event.clientX - event.startX - this[STATE].ax;
      let current = this[STATE].position - (x - (x % 500)) / 500;
      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        children[pos].style.transform = `translateX(${
          -pos * 500 + offset * 500 + (x % 500)
        }px)`;
      }
    });

    // PAN_END__________________________________________________
    this.root.addEventListener("end", (event) => {
      this[STATE].timeLine.reset();
      this[STATE].timeLine.start();
      this[STATE].handler = setInterval(nextPicture, 3000);

      let x = event.clientX - event.startX - this[STATE].ax;
      let current = this[STATE].position - (x - (x % 500)) / 500;
      let direction = Math.round((x % 500) / 500);

      if (event.isFlick) {
        if (event.velocity > 0) {
          direction = Math.ceil((x % 500) / 500);
        } else {
          direction = Math.floor((x % 500) / 500);
        }
      }

      for (let offset of [-1, 0, 1]) {
        let pos = current + offset;
        pos = ((pos % children.length) + children.length) % children.length;

        children[pos].style.transition = "none";
        this[STATE].timeLine.add(
          new Animation(
            children[pos].style,
            "transform",
            -pos * 500 + offset * 500 + (x % 500),
            -pos * 500 + offset * 500 + direction * 500,
            500,
            0,
            ease,
            (v) => `translateX(${v}px)`
          )
        );
      }

      this[STATE].position =
        this[STATE].position - (x - (x % 500)) / 500 - direction;
      this[STATE].position =
        ((this[STATE].position % children.length) + children.length) %
        children.length;
      this.triggerEvent("change", { position: this[STATE].position });
    });

    // AUTO-PLAY__________________________________________________
    let nextPicture = () => {
      let children = this.root.children;
      let nextIndex = (this[STATE].position + 1) % children.length;
      let current = children[this[STATE].position];
      let next = children[nextIndex];

      this[STATE].t = Date.now();

      this[STATE].timeLine.add(
        new Animation(
          current.style, // element
          "transform", // property
          -this[STATE].position * 500, // start
          -500 - this[STATE].position * 500, // end
          500, // time
          0, // delay
          ease, // timingFunction
          (v) => `translateX(${v}px)` // template
        )
      );

      this[STATE].timeLine.add(
        new Animation(
          next.style,
          "transform",
          500 - nextIndex * 500,
          -nextIndex * 500,
          500,
          0,
          ease,
          (v) => `translateX(${v}px)`
        )
      );

      this[STATE].position = nextIndex;
      this.triggerEvent("change", { position: this[STATE].position });
    };

    this[STATE].handler = setInterval(nextPicture, 3000);

    return this.root;
  }
}
```

## children 的触发机制

- 内容型 children(example: Button)

Button.js

```js
import { Component, createElement } from "./Framework";

export class Button extends Component {
  constructor() {
    super();
  }

  render() {
    this.childrenContainer = <span />;
    this.root = (<div>{this.childrenContainer}</div>).render();
    return this.root;
  }

  appendChild(child) {
    if (!this.childrenContainer) this.render();
    this.childrenContainer.appendChild(child);
  }
}
```

Framework.js

```js
export function createElement (type, attributes, ...children) {
    let element
    if (typeof type === 'string')
        element = new ElementWrap(type)
    else
        element = new type

    for (let attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
    }

    for (let child of children) {
        if (typeof child === 'string') {
            child = new TextWrap(child)
        }
        element.appendChild(child)
    }
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
    ...
}

class ElementWrap extends Component {
    constructor (type) {
        super()
        this.root = document.createElement(type)
    }
}

class TextWrap extends Component {
    constructor (content) {
        super()
        this.root = document.createTextNode(content)
    }
}
```

main.js

```js
import { createElement } from "./Framework";
import { Button } from "./Button";

let a = <Button>###</Button>;

a.mountTo(document.body);
```

- 模板型 children(example: List)

List.js

```js
import { Component, STATE, ATTRIBUTE, createElement } from "./Framework";

export { STATE, ATTRIBUTE } from "./Framework";

export class List extends Component {
  constructor() {
    super();
  }

  render() {
    this.children = this[ATTRIBUTE].data.map(this.template);
    this.root = (<div>{this.children}</div>).render();
    return this.root;
  }

  appendChild(child) {
    this.template = child;
    this.render();
  }
}
```

Frameword.js

```js
export function createElement (type, attributes, ...children) {
    let element
    if (typeof type === 'string')
        element = new ElementWrap(type)
    else
        element = new type

    for (let attrName in attributes) {
        element.setAttribute(attrName, attributes[attrName])
    }

    // 递归处理children类型的child
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
    ...
}

class ElementWrap extends Component {
    constructor (type) {
        super()
        this.root = document.createElement(type)
    }
    // 重新赋值属性
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
```

main.js

```js
import { createElement } from "./Framework";
import { List } from "./List";

let d = [
  {
    img:
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
    url: "https://www.baidu.com",
    name: "blue cat",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
    url: "https://www.baidu.com",
    name: "red cat",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
    url: "https://www.baidu.com",
    name: "yellow cat",
  },
  {
    img:
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    url: "https://www.baidu.com",
    name: "origin cat",
  },
];

let a = (
  <List data={d}>
    {(records) => (
      <div>
        <img src={records.img} />
        <a href={records.url}>{records.name}</a>
      </div>
    )}
  </List>
);

a.mountTo(document.body);
```
