import { WebComponent, onChangeProp, renderCallback } from '../../utils'
import Style from './link.style.scss'

@WebComponent({
  selector: 'atom-link',
  style: Style,
  render: '<a><slot></slot></a>',
  props: ['href']
})
export class LinkComponent extends HTMLElement {
  $a: HTMLAnchorElement

  @renderCallback
  getAnchorRef () {
    const { shadowRoot: root } = this
    this.$a = root.querySelector('a')
  }

  @onChangeProp()
  listenProps ({ props }: { [key: string]: string }) {
    Object.entries(props).forEach((prop: string[]) => {
      const [propName, propValue] = prop
      this.$a.setAttribute(propName, propValue)
    })
  }
}
