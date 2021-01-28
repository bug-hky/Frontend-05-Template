import { Component, STATE, ATTRIBUTE, createElement } from './Framework'
import { enableGesture } from './Gesture'
import { TimeLine, Animation } from './Animation'
import { ease } from './Ease'

export { STATE, ATTRIBUTE } from './Framework'

export class List extends Component {
    constructor () {
        super()
    }

    render () {
        this.children = this[ATTRIBUTE].data.map(this.template)
        this.root = (<div>{this.children}</div>).render()
        return this.root
    }

    appendChild (child) {
        this.template = (child)
        this.render()
    }
}