import { Component } from './Framework'

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
        this.root.classList = 'carousel'
        for (let path of this.attributes.src) {
            let child = document.createElement('div')
            child.style.backgroundImage = `url(${path})`
            this.root.appendChild(child)
            // AUTO-PLAY__________________________________________________
            // let currentIndex = 0
            // setInterval(() => {
            //     let children = this.root.children
            //     let nextIndex = (currentIndex + 1) % children.length
            //     let current = children[currentIndex]
            //     let next = children[nextIndex]

            //     next.style.transition = 'none'
            //     next.style.transform = `translateX(${100 - nextIndex * 100}%)`

            //     setTimeout(() => {
            //         next.style.transition = ''
            //         current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
            //         next.style.transform = `translateX(${- nextIndex * 100}%)`
            //         currentIndex = nextIndex
            //     }, 16)
            //     // 16ms为浏览器一帧的时间
            // }, 3000)
            
            let position = 0
            this.root.addEventListener('mousedown', event => {
                console.info('mousedown')
                let children = this.root.children
                // clientX & clientY 表示相对于浏览器的可渲染区域的坐标，他不受任何因素的影响
                let startX = event.clientX
                
                let move = event => {
                    console.info('mousemove')
                    let x = event.clientX - startX

                    let current = position - ((x - x % 500) / 500)

                    for (let offset of [-1, 0, 1]) {
                        let pos = current + offset
                        pos = (pos + children.length) % children.length
                        children[pos].style.transition = 'none'
                        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500 + x % 500}px)`
                    }
                }

                let up = event => {
                    console.info('mouseup')
                    let x = event.clientX - startX
                    position = position - Math.round(x / 500)
                    for (let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]) {
                        let pos = position + offset
                        pos = (pos + children.length) % children.length
                        if (offset === 0) position = pos
                        children[pos].style.transition = ''
                        children[pos].style.transform = `translateX(${- pos * 500 + offset * 500}px)`
                    }
                    document.removeEventListener('mouseup', up)
                    document.removeEventListener('mousemove', move)
                }

                document.addEventListener('mousemove', move)
                document.addEventListener('mouseup', up)
            })
        }
        return this.root
    }

    mountTo (parent) {
        parent.appendChild(this.render())
    }
}