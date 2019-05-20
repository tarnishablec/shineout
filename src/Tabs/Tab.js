import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { tabsClass } from '../styles'
import { getUidStr } from '../utils/uid'
import { varClass } from '../utils/classname'

class Tab extends PureComponent {
  constructor(props) {
    super(props)
    this.getActiveStyle = this.getActiveStyle.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.uid = `tab_unique_${getUidStr()}`
  }

  getActiveStyle() {
    const { shape, align, background, color, border, isActive, isVertical } = this.props

    if (shape === 'line') return {}

    const style = { background, color }

    if (shape !== 'line' && !isVertical)
      style.borderColor = `${border} ${border} ${isActive ? background : border} ${border}`

    if (shape !== 'line' && align === 'vertical-left')
      style.borderColor = `${border} ${isActive ? background : border}  ${border} ${border}`

    if (shape !== 'line' && align === 'vertical-right')
      style.borderColor = `${border} ${border} ${border} ${isActive ? background : border}`

    return style
  }

  handleClick() {
    const { onClick, id, isActive, disabled } = this.props
    if (disabled) return
    onClick(id, isActive)
    if (!this.element) {
      this.element = document.querySelector(`.${this.uid}`)
    }
    if (this.element.getBoundingClientRect) {
      this.props.moveToCenter(this.element.getBoundingClientRect())
    }
  }

  render() {
    const { isActive, disabled, children } = this.props

    const style = this.getActiveStyle()

    const props = {
      className: classnames(
        tabsClass('tab', isActive && 'active', disabled && 'disabled'),
        this.uid,
        isActive && varClass('primary', 'color')
      ),
      onClick: this.handleClick,
      style,
    }

    if (children.type && children.type.isTabLink) {
      return React.cloneElement(children, { ...props })
    }

    return <div {...props}>{children}</div>
  }
}

Tab.propTypes = {
  background: PropTypes.string,
  border: PropTypes.string,
  children: PropTypes.any,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  isVertical: PropTypes.bool,
  id: PropTypes.any.isRequired,
  isActive: PropTypes.bool.isRequired,
  moveToCenter: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  shape: PropTypes.string,
  align: PropTypes.oneOf(['left', 'right', 'vertical-left', 'vertical-right']),
}

Tab.defaultProps = {
  border: 'transparent',
}

export default Tab
