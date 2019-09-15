import { WebComponent } from '../../utils'
import Style from './button.style.scss'

@WebComponent({
  selector: 'molecule-button',
  style: Style,
  render: '<slot></slot>'
})
export class ButtonComponent extends HTMLElement {
}
