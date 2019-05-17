import { isObject } from './is'
import { exposeClass } from '../styles/expose'
import { getUidStr } from './uid'
import config from '../config'

const types = ['primary', 'warning', 'danger', 'success', 'secondary']
const attrs = ['background', 'color', 'border']
const styleReplaceUid = `shineout_STYLE_HR_${getUidStr()}`

function validateFormat(data) {
  if (!isObject(data)) {
    console.error(new Error('Should enter a json data with attrs(key) and types(types)'))
    return false
  }
  // attributes
  if (Object.keys(data).filter(v => attrs.indexOf(v) === -1).length > 0) {
    console.error(new Error(`The attribute your entered does not exist need[${attrs.join('/')}]`))
    return false
  }
  // types
  if (Object.values(data).filter(v => types.indexOf(v) === -1).length > 0) {
    console.error(new Error(`The type your entered does not exist need[${types.join('/')}]`))
    return false
  }
  return true
}

function getClassname(data) {
  if (!validateFormat(data)) return ''
  return Object.keys(data)
    .map(attr => exposeClass(`${data[attr]}-${attr}`))
    .join(' ')
}

function getColor(type) {
  // insert to body make render
  const className = exposeClass(`location-${type}`)
  const div = document.createElement('div')
  div.className = className
  document.body.appendChild(div)
  // get color
  const color = window.getComputedStyle(document.querySelector(`.${className}`)).textDecorationColor
  div.parentElement.removeChild(div)
  return color
}

function styleReplace(text, id) {
  let style = document.head.querySelector(`#${id}`)
  if (style) {
    style.innerHTML = text
    return
  }
  style = document.createElement('style')
  style.type = 'text/css'
  style.id = id
  style.innerHTML = text
  document.head.appendChild(style)
}

export const color = {
  get primary() {
    return getColor('primary')
  },
  get warning() {
    return getColor('warning')
  },
  get danger() {
    return getColor('danger')
  },
  get success() {
    return getColor('success')
  },
  get secondary() {
    return getColor('secondary')
  },
  set set(options) {
    if (!options) return
    let text = ''
    for (const [key, value] of Object.entries(options)) {
      text += `.${config.prefix}-vars-${key} {${key.substring(key.indexOf('-') + 1)}: ${value}}`
    }
    styleReplace(text, styleReplaceUid)
  },
}
window.color = color

export const style = {
  getClassname,
}
