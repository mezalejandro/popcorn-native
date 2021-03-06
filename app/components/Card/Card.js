import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, Dimensions } from 'react-native'
import Device from 'modules/DeviceDetection'

import colors from 'modules/colors'
import dimensions from 'modules/dimensions'

import BaseButton from '../BaseButton'
import Overlay from '../Overlay'
import Image from '../Image'

const { width } = Dimensions.get('window')

const rootWidth = (width - (Device.isTablet ? 40 : 32)) / (Device.isTablet ? 4 : 3)

const styles = StyleSheet.create({

  root: {
    height         : (rootWidth * 1.5),
    width          : rootWidth,
    alignSelf      : 'stretch',
    position       : 'relative',
    borderRadius   : dimensions.BORDER_RADIUS,
    overflow       : 'hidden',
    backgroundColor: colors.BACKGROUND_LIGHTER,
  },

  default: {},

  small: {
    height: dimensions.CARD_SMALL_HEIGHT,
    width : dimensions.CARD_SMALL_WIDTH,
  },

  medium: {
    height: dimensions.CARD_MEDIUM_HEIGHT,
    width : dimensions.CARD_MEDIUM_WIDTH,
  },

})

export const Card = ({ item, variant, empty, ...rest }) => {
  return (
    <BaseButton
      // onLongPress={() => console.warn(item.title)}
      // onPress={() => this.openItem(item)}
      {...rest}>
      <View style={[styles.root, styles[variant]]}>
        <Image
          images={
            empty
              ? {}
              : item.images
          } />

        {item && item.watched && item.watched.complete && (
          <Overlay variant={'dark'} />
        )}

      </View>
    </BaseButton>
  )
}

Card.propTypes = {
  item   : PropTypes.object,
  empty  : PropTypes.bool,
  variant: PropTypes.oneOf([
    'default',
    'medium',
    'small',
  ]),
}

Card.defaultProps = {
  item   : null,
  empty  : false,
  variant: 'default',
}

export default Card
