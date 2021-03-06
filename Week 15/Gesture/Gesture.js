let element = document.documentElement

let isListeningMouse = false
/**
 * mouse实践抽象模型
*/
element.addEventListener('mousedown', e => {
    let context = Object.create(null)
    contexts.set(`mouse${(1 << e.button)}`, context)
    start(e, context)
    mousemove = e => {

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
                if (context) move(e, context)
            }
            button = button << 1
        }
    }
    mouseup = e => {
        // console.info('over.e', e)
        let context = contexts.get(`mouse${(1 << e.button)}`)
        if (context) end(e, context)
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
        start(touch, context)
    }
})

element.addEventListener('touchmove', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        move(touch, context)
    }
})

element.addEventListener('touchend', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        end(touch, context)
        contexts.delete(touch.identifier)
    }
})

element.addEventListener('touchcancel', e => {
    for (let touch of e.changedTouches) {
        let context = contexts.get(touch.identifier)
        cancel(touch, context)
        contexts.delete(touch.identifier)
    }
})


/**
 * 类似于系统中的全局事件会把正在进行的touch事件cancel掉，
 * 如下setTimeout代码执行的时候如果正在touchmove会触发
 * touchcancel事件监听
*/
// setTimeout(() => window.alert('###'), 3000)
let start = (point, context) => {
    context.startX = point.clientX, context.startY = point.clientY
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
        console.info('press')
    }, 500)
}

let move = (point, context) => {
    // 判断是否移动10px
    dx = point.clientX - context.startX, dy = point.clientY - context.startY
    if (!context.isPan && (dx ** 2 + dy ** 2) > 100) {
        context.isPan = true
        context.isTap = false
        context.isPress = false
        clearTimeout(context.handler)
        console.info('startPan')
    }
    
    if (context.isPan) {
        console.info('Pan', dx, dy)
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500)
    context.points.push({
        t: Date.now(),
        x: point.clientX,
        y: point.clientY
    })
}

let end = (point, context) => {
    if (context.isTap) {
        // console.info('tap')
        dispatch('singletap', {})
        clearTimeout(context.handler)
    }
    if (context.isPan) {
        console.info('panend')
    }
    if (context.isPress) {
        console.info('pressend')
    }

    context.points = context.points.filter(point => Date.now() - point.t < 500)
    let velocity, distance
    if (!context.points.length) {
        velocity = 0
    } else {
        distance = Math.sqrt(
            (point.clientX - context.points[0].x) ** 2 +
            (point.clientY - context.points[0].y) ** 2
        )
        velocity = distance / (Date.now() - context.points[0].t)
    }
    // console.info('velocity=>', context.points, distance, velocity)
    if (velocity > 1.5) {
        context.isFlick = true
        dispatch('flick', {})
    } else {
        context.isFlick = false
    }
}

let cancel = (point, context) => {
    clearTimeout(context.handler)
}

// 事件派发

function dispatch (type, properties) {
    let event = new Event(type)
    for (let name in properties) {
        event[name] = properties[name]
    }
    element.dispatchEvent(event)
}