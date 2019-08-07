import { WebComponent } from '../../utils'
import Style from './login.style.scss'
import Render from './login.render.html'

@WebComponent({
  selector: 'module-login',
  style: Style,
  render: Render
})
export class LoginComponent extends HTMLElement {
}
