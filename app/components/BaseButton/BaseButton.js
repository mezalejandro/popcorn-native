import React from 'react'
import PropTypes from 'prop-types'
import { TouchableNativeFeedback } from 'react-native'

export const BaseButton = ({ children, rippleColor, useForeground, ...rest }) => (
  <TouchableNativeFeedback
    useForeground={useForeground}
    // eslint-disable-next-line babel/new-cap
    background={TouchableNativeFeedback.Ripple(rippleColor)}
    {...rest}>
    {children}
  </TouchableNativeFeedback>
)

BaseButton.propTypes = {
  children   : PropTypes.node.isRequired,
  rippleColor: PropTypes.string,
  useForeground: PropTypes.bool,
}

BaseButton.defaultProps = {
  rippleColor: 'rgba(0, 0, 0, .3)',
  useForeground: true,
}

export default BaseButton
