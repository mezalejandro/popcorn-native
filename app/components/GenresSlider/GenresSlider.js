import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View, FlatList } from 'react-native'

import GenreCard from '../GenreCard'
import Typography from '../Typography'

export const styles = StyleSheet.create({

  title: {
    marginLeft: 8,
    marginTop : 8,
  },

})

export const GenresSlider = ({ loading, title, items, onPress, style, cardProps }) => {
  const renderGenre = ({ item }) => (
    <GenreCard
      variant={'small'}
      title={item || ''}
      onPress={() => onPress(item)}
      {...cardProps} />
  )

  return (
    <View style={style}>
      <Typography
        style={styles.title}
        variant={'title'}
        fontWeight={'bold'}>
        {title}
      </Typography>

      <FlatList
        horizontal
        removeClippedSubviews
        style={styles.scrollView}
        data={items.length === 0 ? Array(4).fill() : items}
        initialNumToRender={4}
        windowSize={8}
        renderItem={renderGenre}
        keyExtractor={(item, index) => item || `${index}`}
        showsHorizontalScrollIndicator={false}
      />

    </View>
  )
}

GenresSlider.propTypes = {
  title    : PropTypes.string.isRequired,
  items    : PropTypes.array.isRequired,
  onPress  : PropTypes.func.isRequired,
  style    : PropTypes.object,
  cardProps: PropTypes.object,
}

GenresSlider.defaultProps = {
  style    : null,
  cardProps: {},
  items    : [],
}

export default GenresSlider
