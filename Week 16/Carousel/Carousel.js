import { Component } from './Framework'
import { enableGesture } from './Gesture'
import { Timeline, Animation } from './Animation'
import { ease } from './Ease'

export class Carousel extends Component {
    constructor () {
        super()
        // super() 把render函数触发的时机往后移（到mountTo里面调用）
        this.attributes = Object.create(null)
    }
    // 重写setAttribute函数
    setAttribute (name, value) {
        this.attributes[name] = value
    }

    render () {
        this.root = document.createElement('div')
        this.root.classList.add('carousel')
        for (let path of this.attributes.src) {
            let child = document.createElement('div')
            child.style.backgroundImage = `url(${path})`
            this.root.appendChild(child)
        }

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
            let progress = (Date.now() - t) / 500
            ax = ease(progress) * 500 - 500
        })

        // PAN__________________________________________________
        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax
            let current = position - ((x - x % 500) / 500)
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
            let current = position - ((x - x % 500) / 500)
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

            position = position - ((x - x % 500) / 500) - direction
            position = (position % children.length + children.length) % children.length

        })

        // AUTO-PLAY__________________________________________________
        let nextPicture = () => {
            let children = this.root.children
            let nextIndex = (position + 1) % children.length
            let current = children[position]
            let next = children[nextIndex]

            t = Date.now()

            timeLine.add(new Animation(
                current.style,            // element 
                'transform',              // property
                - position * 500,         // start
                - 500 - position * 500,   // end
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

            position = nextIndex

        }

        handler = setInterval(nextPicture, 3000)

        return this.root
    }

    mountTo (parent) {
        parent.appendChild(this.render())
    }
}