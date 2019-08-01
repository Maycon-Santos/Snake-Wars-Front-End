import { WebComponent, onChangeProp, onChangeState, setState, getState } from '../utils'
import { onChangeGlobalState, getGlobalState, setGlobalState } from '../utils/web-component/app-state'
import Style from './example.style.scss'
import Render from './example.render.html'

@WebComponent({
  selector: 'example-component', // Every selector must have at least one -
  render: Render,
  style: Style,
  props: ['show', 'lala', 'lulu']
})
export class ExampleComponent extends HTMLElement {
  get initialState () {
    // I preferred getter to handle the data before setting
    return {
      value: 0
    }
  }

  constructor () {
    super()
    this.testGetGlobalState()

    setTimeout(() => {
      this.testSetGlobalState()
    }, 1500)
  }

  get defaultProps () {
    return {
      show: 'true',
      lala: 'uai'
    }
  }

  renderCallback () {
    const $button = this.shadowRoot.querySelector('button')
    $button.addEventListener('click', () => this.sum())
  }

  @setState
  updateValue (value: number) { return { value } }

  @getState
  sum (state?) {
    this.updateValue(state.value + 1)
  }

  @onChangeState()
  renderValue ({ host, state }: IOnChange) {
    const $button = host.shadowRoot.querySelector('button')
    if ($button) {
      $button.innerText = String(state.value)
    }
  }

  @onChangeProp('show')
  toggleVisible ({ host, value }: IOnChange) {
    if (value === 'false') {
      host.style.display = 'none'
    } else {
      host.style.display = 'block'
    }
  }

  @onChangeGlobalState('test')
  testGlobalState ({ host, value, state }) {
    console.log(host, value, state)
  }

  @getGlobalState
  testGetGlobalState (state?) {
    console.log(state, 'testGetGlobalState')
  }

  @setGlobalState
  testSetGlobalState () {
    return {
      test: 'lulululu'
    }
  }
}
