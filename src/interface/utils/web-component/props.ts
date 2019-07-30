import { IConstructor, IWebComponentOptions, IOnChange } from './@types/web-components.types'
import { keyHosts, callAfterRender } from './web-component-utils'

const listenedProps = Symbol('Listened Props')

function onChangePropHandler (target: any) {
  return (name: string, oldValue: any, value: any) => {
    target[listenedProps][name].forEach((fn: (...args: any[]) => any) => {
      fn({ value, oldValue })
    })
  }
}

export function defineProps (Constructor: IConstructor, options: IWebComponentOptions) {
  Constructor.observedAttributes = options.props || []
}

export function onChangeProp (attr: string) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value.bind(target)

    if (!target[listenedProps]) {
      target[listenedProps] = []
    }

    if (!target[listenedProps][attr]) {
      target[listenedProps][attr] = []
    }

    if (!target.attributeChangedCallback) {
      target.attributeChangedCallback = onChangePropHandler(target)
    }

    descriptor.value = (args: IOnChange = {}) => {
      args.host = window[keyHosts][target]

      if (!args.props) {
        const _listenedProps = Object.fromEntries(
          Object.keys(target[listenedProps]).map(propName => [propName, null])
        )

        const props = Object.fromEntries(
          Array.from(args.host.attributes).map(prop => {
            return [prop.name, prop.nodeValue]
          })
        )

        args.props = { ..._listenedProps, ...props }
      }

      originalMethod(args)
    }

    target[listenedProps][attr].push(descriptor.value)
    callAfterRender(target, descriptor.value)
  }
}
