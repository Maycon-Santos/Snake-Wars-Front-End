import { WebComponent, getGlobalState, onChangeGlobalState, setGlobalState, disconnectedCallback, connectedCallback } from './utils'
import Style from './root.style.scss'
import Render from './root.render.html'

@WebComponent({
  selector: 'app-root',
  style: Style,
  render: Render
})
export class AppRootComponent extends HTMLElement {
  renderCallback () {
  }

  @connectedCallback
  addEvents () {
    this.windowResizeEvent()
    window.addEventListener('resize', this.windowResizeEvent)
  }

  @disconnectedCallback
  removeEvents () {
    window.removeEventListener('resize', this.windowResizeEvent)
  }

  @setGlobalState
  windowResizeEvent () {
    return {
      'root/window-size': {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }
  }

  @onChangeGlobalState('root/window-size')
  appProportion ({ value: windowSize }) {
    const { width, height } = windowSize
    const aspectRatio = [16, 9]

    const appSize = [width, height]

    if (aspectRatio[1] / aspectRatio[0] <= height / width) {
      appSize[1] = width * aspectRatio[1] / aspectRatio[0]
    } else {
      appSize[0] = height * aspectRatio[0] / aspectRatio[1]
    }

    const fontSize = `${appSize[0] / 1920}px`

    this.style.fontSize = fontSize
    this.style.width = `${appSize[0]}px`
    this.style.height = `${appSize[1]}px`

    document.documentElement.style.fontSize = fontSize
  }
}
