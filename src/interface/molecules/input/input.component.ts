import { WebComponent, setState, onChangeProp, renderCallback } from '../../utils'
import Style from './input.style.scss'
import Render from './input.render.html'

interface Props {
  type: string,
  placeholder?: string,
}

const generatedIDs = new Set()

const OnChange = Symbol('onChange')

@WebComponent({
  selector: 'molecule-input',
  style: Style,
  render: Render,
  props: ['type', 'placeholder']
})
export class InputComponent extends HTMLElement {
  $input: HTMLInputElement

  $label: HTMLLabelElement

  $placeholder: HTMLSpanElement

  get defaultProps (): Props {
    return {
      type: 'text'
    }
  }

  @onChangeProp('type')
  setType ({ value: type }) {
    this.$input.setAttribute('type', type)
  }

  @onChangeProp('placeholder')
  setPlaceholder ({ value: placeholder }) {
    this.$placeholder.innerText = placeholder || ''
  }

  @renderCallback
  getRefs () {
    const { shadowRoot: root } = this

    this.$input = root.querySelector('input')
    this.$label = root.querySelector('label')
    this.$placeholder = root.querySelector('.placeholder')
  }

  @renderCallback
  uniqueLabelID () {
    const ID = Math.round(Math.random() * 1000 * 1000).toString(36)
    if (generatedIDs.has(ID)) return this.uniqueLabelID()
    generatedIDs.add(ID)

    this.$input.setAttribute('id', ID)
    this.$label.setAttribute('for', ID)
  }

  @renderCallback
  _onChange () {
    this.$input.addEventListener('change', e => {
      const event = { ...e }
      event.target = this

      this.hasValue()

      return (typeof this.onchange === 'function') && (
        this.onchange(event)
      )
    })
  }

  hasValue () {
    const { $input } = this
    $input.setAttribute('has-value', String(!!$input.value))
  }
}
