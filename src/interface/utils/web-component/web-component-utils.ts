import { IWebComponentOptions, IConstructor } from './@types/web-components.types'

const keyCallAfterRender = Symbol('Call after Render')
export const keyHosts = Symbol('Host Elements')
window[keyHosts] = {}

export function webComponentUtils (Constructor: IConstructor, options: IWebComponentOptions): IConstructor {
  const { render, style } = options
  class WebComponent extends Constructor {
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })

      window[keyHosts][this] = this

      this.render()
      this.renderCallback()
    }

    connectedCallback () {
      this.defaultProps()
    }

    private defaultProps () {
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
      this.shadowRoot.innerHTML = render || ''
      $style.textContent = style || ''
      this.shadowRoot.appendChild($style)
    }

    private renderCallback () {
      super[keyCallAfterRender].forEach(fn => fn())
      typeof super.renderCallback === 'function' && (
        super.renderCallback()
      )
    }
  }
  return WebComponent
}

export function callAfterRender (target, fn) {
  const host = window[keyHosts]
  if (!target[keyCallAfterRender]) {
    target[keyCallAfterRender] = []
  }
  target[keyCallAfterRender].push(fn)
}
