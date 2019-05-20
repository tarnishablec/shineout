import React from 'react'
import PropTypes from 'prop-types'
import { PureComponent } from '../component'
import { getProps, defaultProps } from '../utils/proptypes'
import Spin from '../Spin'
import icons from '../icons'
import { isPromise } from '../utils/is'
import { isDark } from '../utils/color'
import { tagClass } from '../styles'
import { varClass } from '../utils/classname'

class Tag extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      dismiss: 0,
    }

    this.dismiss = this.dismiss.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.renderClose = this.renderClose.bind(this)
    this.closeTag = this.closeTag.bind(this)
  }

  closeTag() {
    this.setState({ dismiss: 2 })
  }

  dismiss() {
    const { onClose } = this.props
    let callback
    if (onClose === true) {
      this.closeTag()
      return
    }
    if (typeof onClose === 'function') {
      callback = onClose()
    }
    if (isPromise(callback)) {
      this.setState({ dismiss: 1 })
      callback.then(() => {
        this.closeTag()
      })
      return
    }
    this.closeTag()
  }

  handleClick() {
    const { onClick, disabled } = this.props
    if (disabled) return
    if (typeof onClick === 'function') onClick()
  }

  handleClose() {
    const { disabled } = this.props
    if (this.state.dismiss > 0 || disabled) return
    this.dismiss()
  }

  renderClose(dismiss) {
    const { onClose } = this.props
    if (!onClose) return null
    const closeClass = tagClass('close-icon')
    const loadingClass = tagClass('close-loading')
    if (dismiss === 0) {
      return (
        <div
          className={closeClass}
          onClick={this.handleClose}
        >
          {icons.Close}
        </div>
      )
    }
    return (
      <div
        className={loadingClass}
      >
        <Spin name="ring" size={10} />
      </div>
    )
  }

  render() {
    const { dismiss } = this.state
    if (dismiss === 2) return null

    const {
      children, className, type, backgroundColor, onClose,
      disabled,
    } = this.props

    const { style } = this.props

    let tagClassName = tagClass(
      '_',
      disabled && 'disabled',
      type,
      varClass(type, 'background')
    )
    const inlineClassName = tagClass('inline')
    const click = !onClose ? { onClick: this.handleClick } : {}
    let tagStyle = style || {}

    if (className) tagClassName += ` ${className}`
    if (backgroundColor) {
      tagStyle = {
        color: isDark(backgroundColor) ? '#fff' : '#000',
        backgroundColor,
        borderColor: 'transparent',
        ...style,
      }
    }
    return (
      <div className={tagClassName} style={tagStyle} {...click}>
        {
           onClose
           ? <div onClick={this.handleClick} className={inlineClassName}>{children}</div>
           : children
        }
        {this.renderClose(dismiss)}
      </div>
    )
  }
}

Tag.propTypes = {
  ...getProps(PropTypes, 'type'),
  children: PropTypes.any,
  onClose: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
  ]),
  backgroundColor: PropTypes.string,
}

Tag.defaultProps = {
  ...defaultProps,
  type: 'default',
}


export default Tag
