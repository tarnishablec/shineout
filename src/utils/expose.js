import { isObject } from './is'
import { exposeClass } from '../styles/expose'
import { getUidStr } from './uid'
import { varClass } from './classname'

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

function setColor(options) {
  if (!options) return
  let text = ''
  for (const [type, value] of Object.entries(options)) {
    // eslint-disable-next-line no-loop-func
    attrs.forEach(attr => {
      const className = varClass(type, attr)
      const styleName = className.substring(className.indexOf(type) + type.length + 1)
      const originStyle = `.${className}{${styleName}:${value}} `
      text += originStyle
      // cover attr selector
      text += `.${className}[disabled]{${styleName}:${value}} `
      // cover parent-child selector
      text += `[class*="-"] .${className}{${styleName}:${value}; stroke:${value}} `
    })
    // others
    if (type === 'primary') {
      // tabs-tab :after
      text += `[class*="tabs"] [class*="-active"]:after{background:${value}} `
      text += `[class*="tabs"] [class*="-active"]:not(:last-child):after{background:${value}; border-color:${value}} `
      text += `[class*="tabs"] a[class*="active"][class*="link"]{color:${value}} `
      // input hover&focus
      text += `label[class*="-input"]:hover{border-color:${value}} `
      // checkbox
      text += `label[class*="-checkinput-"] i[class*="-checkinput-indicator"][class*="-checkinput-checkbox"]{background:${value};border-color:${value}}`
      text += `label[class*="-checkinput"]:hover i[class*="-checkinput-indicator"][class*="-checkinput-checkbox"]{border-color:${value}} `
    }
  }
  styleReplace(text, styleReplaceUid)
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
  set(options) {
    setColor(options)
  },
}

window.color = color

export const style = {
  getClassname,
}
