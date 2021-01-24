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
        this.state = 'Inited'
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
    }
    // 开始
    start(){
        if (this.state !== 'Inited') return false
        this.state = 'Started'
        let startTime = Date.now()
        // 初始化的暂停时间为0
        this[PAUSE_TIME] = 0
        this[TICK] = () => {
            // let t = Date.now() - startTime
            let now = Date.now()
            
            for(let animation of this[ANIMATIONS]) {
                let t
                if (this[START_TIME].get(animation) < startTime)
                    t = now - startTime - this[PAUSE_TIME] - animation.delay
                else
                    t = now - this[START_TIME].get(animation) - this[PAUSE_TIME] - animation.delay

                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation)
                    t = animation.duration
                }
                // 当t < 0的时候说明延时dealy还没有结束，动画还没有开始
                if (t > 0)  animation.receiveTime(t)
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
        }
        this[TICK]()
    }
    // 播放速率
    // 暂停
    pause () {
        if (this.state !== 'Started') return false
        this.state = 'Paused'
        this[PAUSE_START] = Date.now()
        cancelAnimationFrame(this[TICK_HANDLER])
    }
    // 恢复
    resume () {
        if (this.state !== 'Paused') return false
        this.state = 'Started'
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START]
        this[TICK]()
    }
    // 重置
    reset () {
        this.pause()
        this.state = 'Inited'
        this[ANIMATIONS] = new Set()
        this[START_TIME] = new Map()
        this[TICK_HANDLER] = null
        this[PAUSE_START] = 0
        this[PAUSE_TIME] = 0
    }
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
        // 加上timingFunction和template的默认值处理
        timingFunction = timingFunction || (v => v)
        template = template || (v => v)

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
        // 使用timingFunction处理动画的进度
        let progress = this.timingFunction(time / this.duration)
        this.object[this.property] = this.template(this.startValue + range * progress)
    }
}