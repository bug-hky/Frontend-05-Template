import { Component, STATE, ATTRIBUTE, createElement } from './Framework'
import { enableGesture } from './Gesture'
import { TimeLine, Animation } from './Animation'
import { ease } from './Ease'

export { STATE, ATTRIBUTE } from './Framework'

export class Button extends Component {
    constructor () {
        super()
    }

    render () {
        this.childrenContainer = <span/>
        this.root = (<div>{this.childrenContainer}</div>).render()
        return this.root
    }

    appendChild (child) {
        if (!this.childrenContainer) this.render()
        this.childrenContainer.appendChild(child)
    }
}