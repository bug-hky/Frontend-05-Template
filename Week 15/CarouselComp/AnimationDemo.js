import { Timeline, Animation } from './Animation.js'
import { ease, easeIn, easeOut, easeInOut, linear }  from './Ease.js'
let tl = new Timeline()

tl.start()

// const TIMING_FUNCTIONS = [
//     ease,
//     easeIn,
//     easeOut,
//     easeInOut,
//     linear
// ]

// TIMING_FUNCTIONS.map((func, index) => {
//     tl.add(
//         new Animation(
//             document.querySelector(`#el${index || ''}`).style, // DOM element
//             'transform', // property
//             0, // startValue
//             500, // endValue
//             2000, // duration
//             0, // delay
//             func, // timingFunction
//             v => `translateX(${v}px)` // template
//         )
//     )
// })


tl.add(
    new Animation(
        document.querySelector(`#el`).style, // DOM element
        'transform', // property
        0, // startValue
        500, // endValue
        2000, // duration
        0, // delay
        ease, // timingFunction
        v => `translateX(${v}px)` // template
    )
)

document.querySelector(`#css`).style.transition = 'ease 2s'
document.querySelector(`#css`).style.transform = 'translateX(500px)'

document.querySelector('#pause-btn')
.addEventListener('click', e => tl.pause())

document.querySelector('#resume-btn')
.addEventListener('click', e => tl.resume())