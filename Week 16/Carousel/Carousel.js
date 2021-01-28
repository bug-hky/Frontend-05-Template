import { Component, STATE, ATTRIBUTE } from './Framework'
import { enableGesture } from './Gesture'
import { TimeLine, Animation } from './Animation'
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
        this[STATE].timeLine = new TimeLine
        this[STATE].timeLine.start()


        let children = this.root.children

        this[STATE].position = 0

        this[STATE].t = 0

        this[STATE].ax = 0

        this[STATE].handler = null

        this.root.addEventListener('start', event => {
            this[STATE].timeLine.pause()
            clearInterval(this[STATE].handler)
            let progress = (Date.now() - this[STATE].t) / 500
            this[STATE].ax = ease(progress) * 500 - 500
        })

        this.root.addEventListener('tap', event => {
            this.triggerEvent('click', {
                data: this[ATTRIBUTE].data[this[STATE].position],
                position: this[STATE].position
            })
        })

        // PAN__________________________________________________
        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - this[STATE].ax
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

            this[STATE].timeLine.reset()
            this[STATE].timeLine.start()
            this[STATE].handler = setInterval(nextPicture, 3000)
            
            let x = event.clientX - event.startX - this[STATE].ax
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
                this[STATE].timeLine.add(new Animation(
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

            this[STATE].t = Date.now()

            this[STATE].timeLine.add(new Animation(
                current.style,            // element 
                'transform',              // property
                - this[STATE].position * 500,         // start
                - 500 - this[STATE].position * 500,   // end
                500,                      // time
                0,                        // delay
                ease,                     // timingFunction
                v => `translateX(${v}px)` // template

            ))

            this[STATE].timeLine.add(new Animation(
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

        this[STATE].handler = setInterval(nextPicture, 3000)

        return this.root
    }
}