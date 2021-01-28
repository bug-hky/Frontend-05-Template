import { Component, STATE, ATTRIBUTE } from './Framework'
import { enableGesture } from './Gesture'
import { Timeline, Animation } from './Animation'
import { ease } from './Ease'

export { STATE, ATTRIBUTE } from './Framework'

export class Carousel extends Component {
    constructor () {
        super()
    }

    render () {
        this.root = document.createElement('div')
        this.root.classList.add('carousel')
        for (let item of this[ATTRIBUTE].data) {
            let child = document.createElement('div')
            child.style.backgroundImage = `url(${item.img})`
            this.root.appendChild(child)
        }

        // 为目标元素初始化手势类
        enableGesture(this.root)

        // 新建时间线 & 开始
        let timeLine = new Timeline
        timeLine.start()


        let children = this.root.children

        // let position = 0
        this[STATE].position = 0

        let t = 0

        let ax = 0

        let handler = null

        this.root.addEventListener('start', event => {
            timeLine.pause()
            clearInterval(handler)
            let progress = (Date.now() - t) / 500
            ax = ease(progress) * 500 - 500
        })

        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', {
                data: this[ATTRIBUTE].data[this[STATE].position],
                position: this[STATE].position
            })
        })

        // PAN__________________________________________________
        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)
            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                children[pos].style.transition = 'none'
                children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
            }
        })

        // PAN_END__________________________________________________
        this.root.addEventListener('end', event => {

            timeLine.reset()
            timeLine.start()
            handler = setInterval(nextPicture, 3000)
            
            let x = event.clientX - event.startX - ax
            let current = this[STATE].position - ((x - x % 500) / 500)
            let direction = Math.round((x % 500) / 500)

            if (event.isFlick) {
                if (event.velocity > 0) {
                    direction = Math.ceil((x % 500) / 500)
                } else {
                    direction = Math.floor((x % 500) / 500)
                }
            }

            for (let offset of [-1, 0, 1]) {
                let pos = current + offset
                pos = (pos % children.length + children.length) % children.length

                children[pos].style.transition = 'none'
                timeLine.add(new Animation(
                    children[pos].style,
                    'transform',
                    - pos * 500 + offset * 500 + x % 500,
                    - pos * 500 + offset * 500 + direction * 500,
                    500,
                    0,
                    ease,
                    v => `translateX(${v}px)`
                ))
            }

            this[STATE].position = this[STATE].position - ((x - x % 500) / 500) - direction
            this[STATE].position = (this[STATE].position % children.length + children.length) % children.length
            this.triggerEvent('change', { position: this[STATE].position })

        })

        // AUTO-PLAY__________________________________________________
        let nextPicture = () => {
            let children = this.root.children
            let nextIndex = (this[STATE].position + 1) % children.length
            let current = children[this[STATE].position]
            let next = children[nextIndex]

            t = Date.now()

            timeLine.add(new Animation(
                current.style,            // element 
                'transform',              // property
                - this[STATE].position * 500,         // start
                - 500 - this[STATE].position * 500,   // end
                500,                      // time
                0,                        // delay
                ease,                     // timingFunction
                v => `translateX(${v}px)` // template

            ))

            timeLine.add(new Animation(
                next.style,
                'transform',
                500 - nextIndex * 500,
                - nextIndex * 500,
                500,
                0,
                ease,
                v => `translateX(${v}px)`
            ))

            this[STATE].position = nextIndex
            this.triggerEvent('change', { position: this[STATE].position })

        }

        handler = setInterval(nextPicture, 3000)

        return this.root
    }
}