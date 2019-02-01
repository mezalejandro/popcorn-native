import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Dimensions } from 'react-native'

import Typography from 'components/Typography'
import BaseButton from 'components/BaseButton'

import capitalizeFirstLetter from 'modules/utils/capitalizeFirstLetter'

import genreHolderImage from 'images/genre-holder.jpg'

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({

  genreTextContainer: {
    position: 'absolute',
    width   : '100%',
    height  : '100%',
    left    : 0,
    top     : 0,

    justifyContent: 'center',
    alignItems    : 'center',
  },

})

export const GenreCard = ({ onPress, title, variant }) => (
  <BaseButton onPress={onPress}>
    <View style={{ margin: 8 }}>
      <Image
        style={{
          width       : variant !== 'small' ? width / 2 - 16 :  width / 2.1 - 16,
          height      : variant !== 'small' ? height / 7 : height / 7.1,
          borderRadius: 4,
        }}
        source={genreHolderImage} />

      <View style={styles.genreTextContainer}>
        <Typography
          variant={'title'}
          fontWeight={'bold'}>
          {capitalizeFirstLetter(title)}
        </Typography>
      </View>
    </View>
  </BaseButton>
)

export default GenreCard
