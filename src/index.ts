import ResetStyle from './assets/styles/global/reset.scss'
import DefaultStyle from './assets/styles/global/default.scss'
import FontsStyle from './assets/styles/global/fonts.scss'

import './interface'

const $style = document.createElement('style')
$style.textContent = ResetStyle + DefaultStyle + FontsStyle

document.head.appendChild($style)
