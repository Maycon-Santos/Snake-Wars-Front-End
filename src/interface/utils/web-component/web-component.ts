import { IWebComponentOptions, IConstructor } from './@types/web-components.types'
import { webComponentUtils } from './web-component-utils'
import { defineProps } from './props'

export const Selector = Symbol('Selector Name')

// @Decorator
export function WebComponent (options: IWebComponentOptions) {
  const { selector } = options
  return (Constructor: IConstructor): any => {
    const webComponent = webComponentUtils(Constructor, options)
    webComponent.prototype[Selector] = selector
    defineProps(Constructor, options)
    customElements.define(selector, webComponent)
    return webComponent
  }
}
