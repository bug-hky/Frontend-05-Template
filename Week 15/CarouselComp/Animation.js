// setTimeout
// setInterval
// tick

const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animations')
const START_TIME = Symbol('start-time')
const PAUSE_START = Symbol('pause-start')
const PAUSE_TIME = Symbol('pause-time')

export class Timeline {
    constructor() {
        // 添加animation队列
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
    }
    // 开始
    start(){
        let startTime = Date.now()
        // 初始化的暂停时间为0
        this[PAUSE_TIME] = 0
        this[TICK] = () => {
            // let t = Date.now() - startTime
            let now = Date.now()
            
            for(let animation of this[ANIMATIONS]) {
                let t
                if (this[START_TIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSE_TIME]
                } else {
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME]
                }
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                animation.receiveTime(t)
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    // 播放速率
    pause () {
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLER])
    } // 暂停
    resume () {
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    } // 恢复
    reset(){} // 重启

    // 添加动画
    add (animation, startTime) {
        if (arguments.length < 2) {
            startTime = Date.now()
        }
        this[ANIMATIONS].add(animation)
        this[START_TIME].set(animation, startTime)
    }

}

// 属性动画：把一个对象的某个属性从一个值变成另外一个值
// 帧动画：每一秒来一张图片
export class Animation {
    /**
     * object, property, startValue, endValue, duration这五个属性是必选参数
     * timingFunction差值函数
     * */ 
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        this.object = object
        this.property = property 
        this.startValue = startValue
        this.endValue = endValue
        this.duration = duration
        this.timingFunction = timingFunction
        this.delay = delay
        this.template = template
    }
    receiveTime (time) {
        console.info('time =>', this.object[this.property])
        let range = (this.endValue - this.startValue)
        this.object[this.property] = this.template(this.startValue + range * time / this.duration)
    }
}