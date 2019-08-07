export const lifeCycleSymbols = {
  renderCallback: Symbol('renderCallbacks'),
  connectedCallback: Symbol('connectCallback'),
  disconnectedCallback: Symbol('disconnectedCallback'),
  adoptedCallback: Symbol('adoptedCallback')
}

function register (decoratorName) {
  const symbol = lifeCycleSymbols[decoratorName]
  return (target: any, propertyKey: any, descriptor: PropertyDescriptor) => {
    if (!target[symbol]) {
      target[symbol] = []
    }
    const originalMethod = descriptor.value
    descriptor.value = (...args) => {
      return originalMethod.bind(target.__host)(...args)
    }
    target[symbol].push(descriptor.value)
  }
}

export const renderCallback = register('renderCallback')
export const connectedCallback = register('connectedCallback')
export const disconnectedCallback = register('disconnectedCallback')
export const adoptedCallback = register('adoptedCallback')
