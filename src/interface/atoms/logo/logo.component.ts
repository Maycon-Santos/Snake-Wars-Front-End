import { WebComponent } from '../../utils'
import Style from './logo.style.scss'

@WebComponent({
  selector: 'atom-logo',
  style: Style,
  render: 'Snake<br /><span>Wars</span>'
})
export class LogoComponent extends HTMLElement {}
