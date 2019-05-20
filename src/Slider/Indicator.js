import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import draggable from '../hoc/draggable'
import { sliderClass } from '../styles'
import { varClass } from '../utils/classname'

class Indicator extends PureComponent {
  render() {
    const event = this.props.disabled ? undefined : this.props.onDragStart
    const className = sliderClass('indicator', varClass('primary', 'border'))
    return <div onMouseDown={event} className={className} />
  }
}

Indicator.propTypes = {
  disabled: PropTypes.bool,
  onDragStart: PropTypes.func.isRequired,
}

export default draggable(Indicator)
