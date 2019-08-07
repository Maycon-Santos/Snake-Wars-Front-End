import { callAfterRender } from './web-component-utils'
import { IOnChange } from './@types/web-components.types'

const listenedAllStates = Symbol('Listened All Global State')
const listenedState = {}

const globalState = new Proxy({}, {
  get (state: any, propertyKey: any) {
    return state[propertyKey]
  },
  set (state: any, stateKey: any, value: any) {
    const oldValue = state[stateKey]
    state[stateKey] = value

    const fns = [...(listenedState[listenedAllStates] || []), ...(listenedState[stateKey] || [])]

    fns.forEach((fn: Function) => {
      fn({ value, stateKey, oldValue, state: { ...state } })
    })

    return value
  }
})

export function onChangeGlobalState (state: any = listenedAllStates) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    if (!listenedState[state]) {
      listenedState[state] = []
    }

    descriptor.value = (args: IOnChange = {}) => {
      if (Object.keys(globalState).includes(state)) {
        const host = target.__host

        if (!args.state) {
          args.state = { ...globalState }
        }

        if (!args.value) {
          args.value = globalState[state]
        }

        originalMethod.bind(host)(args)
      }
    }

    listenedState[state].push(descriptor.value)
    callAfterRender(target, descriptor.value)
  }
}

export function setGlobalState (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value.bind(target)
  descriptor.value = (...args: any[]) => {
    const newState = originalMethod(...args)
    Object.keys(newState).forEach(stateKey => {
      globalState[stateKey] = newState[stateKey]
    })
  }
}

export function getGlobalState (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value.bind(target)
  descriptor.value = (...args: any[]) => {
    originalMethod({ ...globalState }, ...args)
  }
}
