export interface IWebComponentOptions {
  selector: string
  render?: string
  style?: string
  useShadowRoot?: boolean
  props?: string[]
}

type TConstructor = new (...args:any[]) => any
export interface IConstructor extends TConstructor {
  [key: string]: any
}

export interface IOnChange {
  host?: HTMLElement
  state?: any
  props?: any
  value?: any
  stateKey?: any
  oldValue?: any
}
