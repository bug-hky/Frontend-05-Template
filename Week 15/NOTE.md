# 抽象动画

> `TODO` 上周内容未全部完成，加班较多，本周补上

## 把 Carousel 类封装为一个模块

## 编写 Animation 类

一个最基础的动画能力是每一帧去执行一些事件

### 帧

javascript 里面处理帧的几种方式：

- setInterval

```js
setInterval(() => {}, 16);
```

注：一般的动画是有一个 16ms 的基本操作，人眼能识别的最高帧率是 60 帧，一般来说浏览器或者游戏都是 60 帧

- setTimeout

```js
let tick = () => {
  setTimeout(tick, 16);
};
```

- requestAnimationFrame
  申请浏览器执行下一帧的时候执行代码，跟随浏览器的帧频来执行，如果浏览器做了降帧降频的操作，它也会跟着变化

```js
let tick = () => {
  requestAnimationFrame(tick);
};
```

现代浏览器环境中推荐使用 tick 函数（setTimeout/requestAnimationFrame），原因：

1. setInterval 不是很可控，浏览器不一定会按照 16ms 去执行
2. tick 写得不好的时候执行的时候 setInterval 会发生积压，setInterval 还没执行完就下一次开始，不同浏览器的底层策略不一致

### 使用 requestAnimationFrame 做一个时间线的操作

#### 初步建立动画与时间线

- cancelAnimationFrame

```js
// 用法
let tick = () => {
  let handler = requestAnimationFrame(tick);
  cancelAnimationFrame(handler);
};
```

- 设计 Timeline 类

Amination.js

```js
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
export class Timeline {
  constructor() {
    this[TICK] = () => {
      console.info("tick trigger");
      requestAnimationFrame(this[TICK]);
    };
  }
  // 开始
  start() {
    this[TICK]();
  }
  // 播放速率
  set rate() {}
  get rate() {}
  pause() {} // 暂停
  resume() {} // 恢复
  reset() {} // 重启
}
```

main.js

```js
import { Timeline } from './Animation'
...
let tl = new Timeline()
tl.start()
```

- 设计 animation 类

```js
// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
  /**
   * object, property, startValue, endValue, duration这五个属性是必选参数
   * timingFunction差值函数
   * */
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receiveTime(time) {
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
```

- 执行 Animation

Amination.js

```js
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
  constructor() {
    // 添加animation队列
    this[ANIMATIONS] = new Set();
  }
  // 开始
  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      console.info("tick trigger");
      for (let animation of this[ANIMATIONS]) {
        animation.receiveTime(Date.now() - startTime);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 播放速率
  // set rate(){}
  // get rate(){}
  pause() {} // 暂停
  resume() {} // 恢复
  reset() {} // 重启

  // 添加动画
  add(animation) {
    this[ANIMATIONS].add(animation);
  }
}

// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
  /**
   * object, property, startValue, endValue, duration这五个属性是必选参数
   * timingFunction差值函数
   * */
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receiveTime(time) {
    console.info("time =>", time);
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
```

main.js

```js
import { Timeline, Animation } from './Animation'

...

let tl = new Timeline()
tl.add(new Animation({}, 'a', 0, 1000, 1000, null))
tl.start()
```

- 设置移除动画的条件

```js
// setTimeout
// setInterval
// tick

const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");

export class Timeline {
  constructor() {
    // 添加animation队列
    this[ANIMATIONS] = new Set();
  }
  // 开始
  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      let t = Date.now() - startTime;
      for (let animation of this[ANIMATIONS]) {
        let t0 = t;
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t0 = animation.duration;
        }
        animation.receiveTime(t0);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 播放速率
  // set rate(){}
  // get rate(){}
  pause() {} // 暂停
  resume() {} // 恢复
  reset() {} // 重启

  // 添加动画
  add(animation) {
    this[ANIMATIONS].add(animation);
  }
}

// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
  /**
   * object, property, startValue, endValue, duration这五个属性是必选参数
   * timingFunction差值函数
   * */
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
  }
  receiveTime(time) {
    console.info("time =>", this.object[this.property]);
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
```

#### 设计时间线的更新

Animation.js

```js
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");

export class Timeline {
  constructor() {
    // 添加animation队列
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  // 开始
  start() {
    let startTime = Date.now();
    this[TICK] = () => {
      // let t = Date.now() - startTime
      let now = Date.now();

      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime;
        } else {
          t = now - this[START_TIME].get(animation);
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        animation.receiveTime(t);
      }
      requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  pause() {} // 暂停
  resume() {} // 恢复
  reset() {} // 重启

  // 添加动画
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
  /**
   * object, property, startValue, endValue, duration这五个属性是必选参数
   * timingFunction差值函数
   * */
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
  }
  receiveTime(time) {
    console.info("time =>", this.object[this.property]);
    let range = this.endValue - this.startValue;
    this.object[this.property] =
      this.startValue + (range * time) / this.duration;
  }
}
```

main.js

```js
import { Timeline, Animation } from "./Animation";

let tl = new Timeline();

// 把tl挂载到window上，在console里面动态执行tl.add(animation)
window.tl = tl;
window.animation = new Animation({}, "a", 0, 100, 1000, null);

tl.start();
```

#### 给动画添加暂停和重启功能

> 改进 pause&resume 方法

```js
 start () {
    ...
    this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
 }
 // 暂停
 pause () {
     cancelAnimationFrame(this[TICK_HANDLER])
 }
 // 恢复
 resume () {
     this[TICK_HANDLER]
 }
```

> 添加 DOM 操作相关 demo

新添加文件`AnimationDemo.html`&`AnimationDemo.js`

AnimationDemo.html

```html
<body>
  <div
    id="el"
    style="width:100px;height:100px;background-color: lightblue;"
  ></div>
  <script type="module" src="./AnimationDemo.js"></script>
</body>
```

AnimationDemo.js

```js
import { Timeline, Animation } from "./Animation.js";
let tl = new Timeline();

tl.start();
tl.add(
  new Animation(
    document.querySelector("#el").style, // DOM element
    "transform", // property
    0, // startValue
    500, // endValue
    2000, // duration
    0, // delay
    null, // timingFunction
    (v) => `translateX(${v}px)` // template
  )
);
```

> 在变量 t 上做处理减去暂停时间

AnimationDemo.html

```html
<body>
  <div
    id="el"
    style="width:100px;height:100px;background-color: lightblue;"
  ></div>
  <button id="pause-btn">pause</button>
  <button id="resume-btn">resume</button>
  <script type="module" src="./AnimationDemo.js"></script>
</body>
```

AnimationDemo.js

```js
import { Timeline, Animation } from "./Animation.js";
let tl = new Timeline();

tl.start();
tl.add(
  new Animation(
    document.querySelector("#el").style, // DOM element
    "transform", // property
    0, // startValue
    500, // endValue
    2000, // duration
    0, // delay
    null, // timingFunction
    (v) => `translateX(${v}px)` // template
  )
);

document
  .querySelector("#pause-btn")
  .addEventListener("click", (e) => tl.pause());

document
  .querySelector("#resume-btn")
  .addEventListener("click", (e) => tl.resume());
```

Animation.js

```js
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const START_TIME = Symbol("start-time");
const PAUSE_START = Symbol("pause-start");
const PAUSE_TIME = Symbol("pause-time");

export class Timeline {
  constructor() {
    // 添加animation队列
    this[ANIMATIONS] = new Set();
    this[START_TIME] = new Map();
  }
  // 开始
  start() {
    let startTime = Date.now();
    // 初始化的暂停时间为0
    this[PAUSE_TIME] = 0;
    this[TICK] = () => {
      // let t = Date.now() - startTime
      let now = Date.now();

      for (let animation of this[ANIMATIONS]) {
        let t;
        if (this[START_TIME].get(animation) < startTime) {
          t = now - startTime - this[PAUSE_TIME];
        } else {
          t = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
        }
        if (animation.duration < t) {
          this[ANIMATIONS].delete(animation);
          t = animation.duration;
        }
        animation.receiveTime(t);
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
    };
    this[TICK]();
  }
  // 播放速率
  pause() {
    this[PAUSE_START] = Date.now();
    cancelAnimationFrame(this[TICK_HANDLER]);
  } // 暂停
  resume() {
    this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
    this[TICK]();
  } // 恢复
  reset() {} // 重启

  // 添加动画
  add(animation, startTime) {
    if (arguments.length < 2) {
      startTime = Date.now();
    }
    this[ANIMATIONS].add(animation);
    this[START_TIME].set(animation, startTime);
  }
}

// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
  /**
   * object, property, startValue, endValue, duration这五个属性是必选参数
   * timingFunction差值函数
   * */
  constructor(
    object,
    property,
    startValue,
    endValue,
    duration,
    delay,
    timingFunction,
    template
  ) {
    this.object = object;
    this.property = property;
    this.startValue = startValue;
    this.endValue = endValue;
    this.duration = duration;
    this.timingFunction = timingFunction;
    this.delay = delay;
    this.template = template;
  }
  receiveTime(time) {
    console.info("time =>", this.object[this.property]);
    let range = this.endValue - this.startValue;
    this.object[this.property] = this.template(
      this.startValue + (range * time) / this.duration
    );
  }
}
```
