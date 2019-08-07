import { WebComponent, onChangeProp, onChangeState, setState, getState, renderCallback } from '../utils'
import { onChangeGlobalState, getGlobalState, setGlobalState } from '../utils/web-component/global-state'
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

  @renderCallback
  setButtonClickEvent () {
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
  renderValue ({ state }) {
    const $button = this.shadowRoot.querySelector('button')
    if ($button) {
      $button.innerText = String(state.value)
    }
  }

  @onChangeProp('show')
  toggleVisible ({ value }) {
    if (value === 'false') {
      this.style.display = 'none'
    } else {
      this.style.display = 'block'
    }
  }

  @onChangeGlobalState('test')
  testGlobalState ({ value, state }) {
    console.log(this, value, state)
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
