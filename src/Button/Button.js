import React, { PureComponent, Children, isValidElement } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { getProps, defaultProps } from '../utils/proptypes'
import Spin from '../Spin'
import { varClass } from '../utils/classname'
import { buttonClass } from '../styles'

const spinStyle = { display: 'inline-block', marginRight: 8 }

class Button extends PureComponent {
  getChildren() {
    const { children, loading } = this.props
    if (!loading) return children
    const filtered = Children.toArray(children).filter(child => {
      const validElement = isValidElement(child) && child !== null
      if (validElement && child.type.isShineoutIcon) return false
      return true
    })
    return filtered
  }

  render() {
    const {
      outline, type, size, href, htmlType, loading, disabled, onRef, ...others
    } = this.props
    const className = classnames(
      buttonClass('_', type, outline && 'outline', {
        large: size === 'large',
        small: size === 'small',
      }),
      outline ? varClass(type, 'border', type, 'color') : varClass(type, 'background'),
      this.props.className,
    )

    if (href) {
      return (
        <a href={href} {...others} className={className}>
          {this.props.children}
        </a>
      )
    }

    const children = this.getChildren()
    return (
      <button {...others} ref={onRef} disabled={disabled || loading} type={htmlType} className={className}>
        {
          loading &&
          <span style={spinStyle}>
            <Spin size={12} name="ring" color="#fff" />
          </span>
        }
        {children}
      </button>
    )
  }
}

Button.propTypes = {
  ...getProps(PropTypes, 'disabled', 'size', 'type'),
  children: PropTypes.any,
  href: PropTypes.string,
  htmlType: PropTypes.string,
  loading: PropTypes.bool,
  onRef: PropTypes.func,
  outline: PropTypes.bool,
}

Button.defaultProps = {
  ...defaultProps,
  htmlType: 'button',
  outline: false,
  type: 'default',
}

export default Button
