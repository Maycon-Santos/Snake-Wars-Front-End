import { IWebComponentOptions, IConstructor } from './@types/web-components.types'
import { lifeCycleSymbols } from './lifecycle'

const keyCallAfterRender = Symbol('Call after Render')
export const keyHosts = Symbol('Host Elements')

window[keyHosts] = {}

export function webComponentUtils (Constructor: IConstructor, options: IWebComponentOptions): IConstructor {
  const { render: rawRender, style } = options
  let host
  Object.defineProperty(Constructor.prototype, '__host', {
    get: () => host
  })
  class WebComponent extends Constructor {
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })

      host = this

      this.render()
      this.renderCallback()
    }

    call (_functions) {
      if (_functions) {
        _functions.forEach(_function => {
          if (typeof _function === 'function') {
            _function()
          }
        })
      }
    }

    connectedCallback () {
      this.setDefaultProps()
      this.call(super[lifeCycleSymbols.connectedCallback])
    }

    disconnectedCallback () {
      this.call(super[lifeCycleSymbols.disconnectedCallback])
    }

    adoptedCallback () {
      this.call(super[lifeCycleSymbols.adoptedCallback])
    }

    private setDefaultProps () {
      if (super.defaultProps) {
        Object.entries(super.defaultProps).forEach(prop => {
          const [propName, propValue] = prop
          if (!this.hasAttribute(propName)) {
            this.setAttribute(propName, propValue)
          }
        })
      }
    }

    private render () {
      const $style = document.createElement('style')
      const render = rawRender || ''

      $style.textContent = style || ''
      this.shadowRoot.innerHTML = render

      this.shadowRoot.appendChild($style)
    }

    private renderCallback () {
      this.call(super[lifeCycleSymbols.renderCallback])

      if (super[keyCallAfterRender]) {
        super[keyCallAfterRender].forEach(fn => fn())
      }
    }
  }
  return WebComponent
}

export function callAfterRender (target, fn) {
  if (!target[keyCallAfterRender]) {
    target[keyCallAfterRender] = []
  }
  target[keyCallAfterRender].push(fn)
}
