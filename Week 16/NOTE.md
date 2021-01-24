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
