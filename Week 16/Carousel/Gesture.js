export class Listener {
    constructor (element, recognize) {
        this.element = element

        let isListeningMouse = false

        /**
         * mouse实践抽象模型
        */
    
        element.addEventListener('mousedown', e => {
            let context = Object.create(null)
            contexts.set(`mouse${(1 << e.button)}`, context)
            recognize.start(e, context)
            let mousemove = e => {

                let button = 1
                while (button <= e.buttons) {
                    // console.info('button', button)
                    // console.info('buttons', e.buttons)
                    if (button && e.buttons) {
                        let key
                        /**
                         * event.button和event.buttons的关系: 1 << event.button === event.buttons 
                         * (buttons的滚轮和右键需要反转) 
                        */
                        if (button === 2)
                            key = 4
                        else if (button === 4)
                            key = 2
                        else
                            key = button
                        let context = contexts.get(`mouse${key}`)
                        // console.info(':', `mouse${key}`)
                        // console.info('::', contexts)
                        // console.info(':::', context)
                        if (context) recognize.move(e, context)
                    }
                    button = button << 1
                }
            }
            let mouseup = e => {
                // console.info('over.e', e)
                let context = contexts.get(`mouse${(1 << e.button)}`)
                if (context) recognize.end(e, context)
                contexts.delete(`mouse${(1 << e.button)}`)
                if (e.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove)
                    document.removeEventListener('mouseup', mouseup)
                    isListeningMouse = false
                }
            }
            if (!isListeningMouse) {
                document.addEventListener('mousemove', mousemove)
                document.addEventListener('mouseup', mouseup)
                isListeningMouse = true
            }
        })

        /**
         * touch事件抽象
        */

        let contexts = new Map()

        element.addEventListener('touchstart', e => {
            console.info(e.changedTouches)
            for (let touch of e.changedTouches) {
                let context = Object.create(null)
                contexts.set(touch.identifier, context)
                recognize.start(touch, context)
            }
        })

        element.addEventListener('touchmove', e => {
            for (let touch of e.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognize.move(touch, context)
            }
        })

        element.addEventListener('touchend', e => {
            for (let touch of e.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognize.end(touch, context)
                contexts.delete(touch.identifier)
            }
        })

        element.addEventListener('touchcancel', e => {
            for (let touch of e.changedTouches) {
                let context = contexts.get(touch.identifier)
                recognize.cancel(touch, context)
                contexts.delete(touch.identifier)
            }
        })
    }
}

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
        context.startX = point.clientX, context.startY = point.clientY

        this.dispatcher.dispatch('start', {
            clientX: point.clientX,
            clientY: point.clientY
        })

        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]
        context.isPan = false
        context.isTap = true
        context.isPress = false
        context.handler = setTimeout(() => {
            context.isPan = false
            context.isTap = false
            context.isPress = true
            // 避免多次clearTimeout
            context.handler = null
            this.dispatcher.dispatch('pressStart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY
            })
        }, 500)
    }

    move (point, context) {
        // 判断是否移动10px
        let dx = point.clientX - context.startX, dy = point.clientY - context.startY
        if (!context.isPan && (dx ** 2 + dy ** 2) > 100) {
            context.isPan = true
            context.isTap = false
            context.isPress = false
            clearTimeout(context.handler)
            this.dispatcher.dispatch('panStart', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isHorizontal: Math.abs(dx) > Math.abs(dy)
            })
        }
        
        if (context.isPan) {
            this.dispatcher.dispatch('pan', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isHorizontal: Math.abs(dx) > Math.abs(dy)
            })
            // console.info('Pan', dx, dy)
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500)
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        })
    }

    end (point, context) {
        let dx = point.clientX - context.points[0].x, dy = point.clientY - context.points[0].y
        if (context.isTap) {
            this.dispatcher.dispatch('tap', {})
            clearTimeout(context.handler)
        }

        if (context.isPress) {
            this.dispatcher.dispatch('pressEnd', {
                t: Date.now() - context.points[0].t
            })
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500)
        let velocity, distance
        if (!context.points.length) {
            velocity = 0
        } else {
            distance = Math.sqrt(dx ** 2 + dy ** 2)
            velocity = distance / (Date.now() - context.points[0].t)
        }
        // console.info('velocity=>', context.points, distance, velocity)
        if (velocity > 1.5) {
            context.isFlick = true
            context.isPan = false
            this.dispatcher.dispatch('flick', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isHorizontal: Math.abs(dx) > Math.abs(dy),
                velocity: velocity
            })
        } else {
            context.isFlick = false
        }

        if (context.isPan) {
            this.dispatcher.dispatch('panEnd', {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isHorizontal: Math.abs(dx) > Math.abs(dy),
                isFlick: context.isFlick,
                velocity: velocity
            })
        }

        this.dispatcher.dispatch('end', {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isHorizontal: Math.abs(dx) > Math.abs(dy),
            isFlick: context.isFlick,
            velocity: velocity
        })
    }

    cancel (point, context) {
        clearTimeout(context.handler)
    }
}

export class Dispatch {
    constructor (element) {
        this.element = element
    }

    dispatch (type, properties) {
        let event = new Event(type)
        for (let name in properties) {
            event[name] = properties[name]
        }
        this.element.dispatchEvent(event)
    }
}

export function enableGesture (element) {
    return new Listener(element, new Recognize(new Dispatch(element)))
}