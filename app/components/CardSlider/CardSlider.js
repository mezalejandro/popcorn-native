import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList } from 'react-native'

import dimensions from 'modules/dimensions'

import Card from '../Card'
import Typography from '../Typography'

export const styles = StyleSheet.create({

  title: {
    marginLeft  : dimensions.UNIT * 2,
    marginBottom: dimensions.UNIT / 2,
  },

  image: {
    height    : '100%',
    width     : '100%',
    resizeMode: 'cover',
  },

  container: {
    marginLeft: dimensions.UNIT * 2,
  },

})

export const CardSlider = ({ loading, title, items, onPress, style }) => {
  const renderCard = ({ item }) => (
    <Card
      variant={'medium'}
      empty={!item}
      item={item}
      onPress={() => onPress(item)}
    />
  )

  return (
    <View style={style}>

      <Typography
        style={styles.title}
        variant={'display6'}
        fontWeight={'medium'}>
        {title}
      </Typography>

      <FlatList
        horizontal
        removeClippedSubviews
        contentContainerStyle={styles.container}
        data={items.length === 0 ? Array(4).fill() : items}
        initialNumToRender={4}
        windowSize={5}
        renderItem={renderCard}
        ItemSeparatorComponent={() => <View style={{ width: dimensions.UNIT }} />}
        ListFooterComponent={() => <View style={{ width: dimensions.UNIT * 5 }} />}
        keyExtractor={(item, index) => item ? item.id : `${index}`}
        showsHorizontalScrollIndicator={false}
        snapToInterval={dimensions.CARD_MEDIUM_WIDTH + dimensions.UNIT}
        snapToAlignment={'center'}
      />

    </View>
  )
}

export default CardSlider
