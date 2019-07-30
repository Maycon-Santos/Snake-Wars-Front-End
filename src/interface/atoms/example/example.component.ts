import { WebComponent, onChangeProp, onChangeState, setState, getState, IOnChange } from '../../utils'

@WebComponent({
  selector: 'example-component', // Every selector must have at least one -
  render: 'Click me: <button>Button text</button>',
  style: `button{
    width: 200px;
    height: 200px;
    border: none;
    outline: none;
    color: #333;
    font-size: 22px;
    font-weight: bold;
    background: lightblue;
  }`,
  props: ['show', 'lala', 'lulu']
})
export class ExampleComponent extends HTMLElement {
  get initialState () {
    // I preferred getter to handle the data before setting
    return {
      value: 0
    }
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
  renderValue ({ host, state }: IOnChange = {}) {
    const $button = host.shadowRoot.querySelector('button')
    if ($button) {
      $button.innerText = String(state.value)
    }
  }

  @onChangeProp('show')
  toggleVisible ({ host, value }: IOnChange = {}) {
    if (value === 'false') {
      host.style.display = 'none'
    } else {
      host.style.display = 'block'
    }
  }
}
