import { Component, createElement } from './Framework'
import { Carousel } from './Carousel'
import { Timeline, Animation } from './Animation'

let d = [
    {
        img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
        url: 'https://www.baidu.com',
    },
    {
        img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
        url: 'https://www.baidu.com',
    },
    {
        img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
        url: 'https://www.baidu.com',
    },
    {
        img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
        url: 'https://www.baidu.com',
    }
]

let a = <Carousel
            data={d}
            onChange={event => console.info(event.detail.position)}
            onClick={event => window.location.href = event.detail.data.url}
        />
a.mountTo(document.body)

// let tl = new Timeline()

// 把tl挂载到window上，在console里面动态执行tl.add(animation)
// window.tl = tl
// window.animation = new Animation({}, 'a', 0, 100, 1000, null)

// tl.start()