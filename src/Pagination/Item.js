import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { paginationClass } from '../styles'
import { varClass } from '../utils/classname'

class Item extends PureComponent {
  constructor(props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { page, onClick } = this.props
    onClick(page)
  }

  render() {
    const { children, isCurrent, disabled } = this.props
    const className = paginationClass(
      'item',
      this.props.className,
      isCurrent && 'current',
      isCurrent && varClass('primary', 'border', 'primary', 'background')
    )

    return (
      <a
        className={className}
        disabled={disabled || isCurrent}
        onMouseDown={this.handleClick}
        href="javascript:;"
      >
        {children}
      </a>
    )
  }
}

Item.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  isCurrent: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
}

Item.defaultProps = {
  disabled: false,
  isCurrent: false,
}

export default Item
