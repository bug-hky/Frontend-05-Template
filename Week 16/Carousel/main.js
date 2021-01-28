import { Component, createElement } from './Framework'
import { Carousel } from './Carousel'
import { Button } from './Button'
import { TimeLine, Animation } from './Animation'
import { List } from './List'

/*
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
*/

// let a = <Button>
//     ###
// </Button>


let d = [
    {
        img: 'https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg',
        url: 'https://www.baidu.com',
        name: 'blue cat'
    },
    {
        img: 'https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg',
        url: 'https://www.baidu.com',
        name: 'red cat'
    },
    {
        img: 'https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg',
        url: 'https://www.baidu.com',
        name: 'yellow cat'
    },
    {
        img: 'https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg',
        url: 'https://www.baidu.com',
        name: 'origin cat'
    }
]

let a = <List data={d}>
{(records) => 
    <div>
        <img src={records.img} />
        <a href={records.url}>{records.name}</a> 
    </div>
}    
</List>

a.mountTo(document.body)