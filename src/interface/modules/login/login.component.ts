import { WebComponent, renderCallback } from '../../utils'
import Style from './login.style.scss'
import Render from './login.render.html'
import { toModule } from '../../root.component'

@WebComponent({
  selector: 'module-login',
  style: Style,
  render: Render
})
export class LoginComponent extends HTMLElement {
  $submit: HTMLElement

  @renderCallback
  getRefs () {
    const { shadowRoot: root } = this
    console.log(root)
    this.$submit = root.querySelector('#login-submit')
  }

  @renderCallback
  addEventsListeners () {
    const { $submit } = this
    $submit.addEventListener('click', this.submit)
  }

  submit = () => {
    toModule('module-main')
  }
}
