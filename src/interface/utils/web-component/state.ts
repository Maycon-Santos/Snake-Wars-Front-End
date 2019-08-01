import { IOnChange } from './@types/web-components.types'
import { keyHosts, callAfterRender } from './web-component-utils'

const listenedState = Symbol('Listened State')
const listenAllStates = Symbol('Listen All States')

function defineInitialState (target: any) {
  if (!target.state) {
    target.state = new Proxy({ ...(target.initialState || {}) }, {
      get (state: any, propertyKey: any) {
        return state[propertyKey]
      },
      set (state: any, stateKey: any, value: any) {
        const oldValue = state[stateKey]
        state[stateKey] = value

        const listenedAllStates = target[listenedState][listenAllStates]

        const fns = [...(listenedAllStates || []), ...(target[listenedState][stateKey] || [])]

        fns.forEach((fn: Function) => {
          fn({ value, stateKey, oldValue, state: { ...state } })
        })

        return value
      }
    })
  }
}

export function onChangeState (state: any = listenAllStates) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value.bind(target)

    defineInitialState(target)

    if (!target[listenedState]) {
      target[listenedState] = {}
    }

    if (!target[listenedState][state]) {
      target[listenedState][state] = []
    }

    descriptor.value = (args: IOnChange = {}) => {
      args.host = window[keyHosts][target]

      if (!args.state) {
        args.state = { ...target.state }
      }

      if (!args.value && state !== listenAllStates) {
        args.value = target.state[state]
      }

      originalMethod(args)
    }

    target[listenedState][state].push(descriptor.value)
    callAfterRender(target, descriptor.value)
  }
}

export function setState (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value.bind(target)
  descriptor.value = (...args: any[]) => {
    const newState = originalMethod(...args)

    defineInitialState(target)

    Object.keys(newState).forEach(stateKey => {
      target.state[stateKey] = newState[stateKey]
    })
  }
}

export function getState (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value.bind(target)
  descriptor.value = (...args: any[]) => {
    defineInitialState(target)
    originalMethod({ ...target.state }, ...args)
  }
}
