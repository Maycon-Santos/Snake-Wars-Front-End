import { IWebComponentOptions, IConstructor } from './@types/web-components.types'

const keyCallAfterRender = Symbol('Call after Render')
export const keyHosts = Symbol('Host Elements')
window[keyHosts] = {}

export function webComponentUtils (Constructor: IConstructor, options: IWebComponentOptions): IConstructor {
  const { render: rawRender, style } = options
  class WebComponent extends Constructor {
    constructor () {
      super()

      this.attachShadow({ mode: 'open' })

      window[keyHosts][this] = this

      this.render()
      this.renderCallback()
    }

    call (fn) {
      if (typeof fn === 'function') {
        fn()
      }
    }

    connectedCallback () {
      this.defaultProps()
      this.call(super.connectedCallback())
    }

    disconnectedCallback () {
      this.call(super.disconnectedCallback())
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
      const children = this.innerHTML
      const render = rawRender || ''

      $style.textContent = style || ''
      this.shadowRoot.innerHTML = render.replace(/\w*(?<!\\)\(children\)/g, children)

      this.shadowRoot.appendChild($style)
    }

    private renderCallback () {
      if (super[keyCallAfterRender]) {
        super[keyCallAfterRender].forEach(fn => fn())
      }
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
