import { WebComponent, onChangeProp } from '../../utils'
import Style from './card.style.scss'

interface Props {
  size: string
}

@WebComponent({
  selector: 'organism-card',
  style: Style,
  render: '<slot></slot>',
  props: ['size']
})
export class CardComponent extends HTMLElement {
  get defaultProps (): Props {
    return {
      size: 'small'
    }
  }
}
