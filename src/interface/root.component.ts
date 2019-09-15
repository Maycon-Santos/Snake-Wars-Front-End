import { WebComponent, onChangeGlobalState, setGlobalState, disconnectedCallback, connectedCallback, Selector } from './utils'
import * as modules from './modules/modules.load'
import Style from './root.style.scss'
import Render from './root.render.html'

@WebComponent({
  selector: 'app-root',
  style: Style,
  render: Render
})
export class Root extends HTMLElement {
  private _currentModule = 'module-login'

  setCurrentModule (module) {
    this._currentModule = module
    this.router()
  }

  @connectedCallback
  router () {
    console.log(this._currentModule)
    for (const moduleName in modules) {
      const module = modules[moduleName]
      if (module.prototype[Selector] === this._currentModule) {
        const $screens = this.shadowRoot.querySelector('.screens')
        $screens.innerHTML = ''
        $screens.appendChild(document.createElement(this._currentModule))
      }
    }
  }

  @connectedCallback
  addEvents () {
    window.addEventListener('resize', this.windowResizeEvent)
  }

  @disconnectedCallback
  removeEvents () {
    window.removeEventListener('resize', this.windowResizeEvent)
  }

  @connectedCallback
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

export function toModule (module) {
  const $root: Root = document.querySelector('app-root')
  console.dir($root)
  $root.setCurrentModule(module)
}
