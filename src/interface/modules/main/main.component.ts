import { WebComponent } from '../../utils'
import Style from './main.style.scss'
import Render from './main.render.html'

@WebComponent({
  selector: 'module-main',
  style: Style,
  render: Render
})
export class MainComponent extends HTMLElement {
}
