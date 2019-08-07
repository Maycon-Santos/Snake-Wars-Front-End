import { WebComponent } from '../../utils'
import Style from './background.style.scss'

@WebComponent({
  selector: 'organism-background',
  style: Style
})
export class BackgroundComponent extends HTMLElement {}
