import { WebComponent, getGlobalState, onChangeGlobalState, setGlobalState } from './utils'
import Style from './root.style.scss'

// console.log(rootState)

@WebComponent({
  selector: 'app-root',
  style: Style
})
export class AppRootComponent extends HTMLElement {
  renderCallback () {
  }

  connectedCallback () {
    this.windowResizeEvent()
    window.addEventListener('resize', this.windowResizeEvent)
  }

  disconnectedCallback () {
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
  appProportion ({ host, value: windowSize }) {
    const { width, height } = windowSize
    const aspectRatio = [16, 9]

    const appSize = [width, height]

    if (aspectRatio[1] / aspectRatio[0] <= height / width) {
      appSize[1] = width * aspectRatio[1] / aspectRatio[0]
    } else {
      appSize[0] = height * aspectRatio[0] / aspectRatio[1]
    }

    host.style.width = `${appSize[0]}px`
    host.style.height = `${appSize[1]}px`
  }
}
