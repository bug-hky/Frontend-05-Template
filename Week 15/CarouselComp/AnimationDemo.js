import { Timeline, Animation } from './Animation.js'
let tl = new Timeline()

tl.start()
tl.add(
    new Animation(
        document.querySelector('#el').style, // DOM element
        'transform', // property
        0, // startValue
        500, // endValue
        2000, // duration
        0, // delay
        null, // timingFunction
        v => `translateX(${v}px)` // template
    )
)

document.querySelector('#pause-btn')
.addEventListener('click', e => tl.pause())

document.querySelector('#resume-btn')
.addEventListener('click', e => tl.resume())