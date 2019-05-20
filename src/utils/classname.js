import classnames from 'classnames'
import config from '../config'

const varClassPrefix = `${config.prefix}-var`

/**
 * create a new className generate function, add namespace, handle css module
 * @param style - object; for css module
 * @param module - string
 * @param prefix - string, default value is 'shineout'
 * * */
export default (style, module, prefix = config.prefix) => (...args) => {
  const className = classnames(...args)
  if (!className) return ''

  const ns = `${prefix}${module ? `-${module}` : '-'}`
  let list = className.split(' ').map(c => {
    if (c.startsWith(varClassPrefix)) return c
    return c === '_' ? ns : `${ns}-${c}`
  })
  if (config.cssModule) {
    list = list.map(c => style[c] || c)
  }
  return list.join(' ')
}

export function varClass(...args) {
  let className = ''
  while (args.length) {
    const type = Array.prototype.shift.call(args)
    const attr = Array.prototype.shift.call(args)
    if (type && attr) {
      className += ` ${varClassPrefix}-${type}-${attr}`
      if (attr !== 'color') className += '-color'
    }
  }
  className = className.substring(1)
  return className
}
