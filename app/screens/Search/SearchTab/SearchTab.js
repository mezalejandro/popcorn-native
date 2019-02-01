import React from 'react'
import { View, FlatList, StyleSheet, Animated } from 'react-native'
import * as Animatable from 'react-native-animatable'

import ScrollView from '../searchBarAnimation/ScrollView'
import Typography from 'components/Typography'

import { ALL_GENRES } from 'modules/genres'
import colors from 'modules/colors'

import SearchBar from '../SearchBar'

export const styles = StyleSheet.create({

  bottomBar: {
    marginTop: 50,
  },

})

export default class SearchTab extends React.Component {

  renderTile = ({ item: genre }) => (
    <View style={{ height: 30, width: '100%' }}>
      <Typography style={{
        width : '100%',
        margin: 16,
      }} variant={'body2'}>
        {genre}
      </Typography>
    </View>
  )

  render() {
    const { searching, containerStyle } = this.props

    if (!searching) {
      return null
    }

    return (
      <Animatable.View
        style={containerStyle}
        animation={'fadeIn'}
        duration={150}
        useNativeDriver>

        <View
          style={{
            height         : '100%',
            backgroundColor: colors.BACKGROUND,
            opacity        : 0.9,
            position       : 'absolute',
            top            : 0,
            bottom         : 0,
            width          : '100%',
          }}
        />

        <ScrollView
          withOnScroll={false}
          contentContainerStyle={{ paddingTop: SearchBar.searchInputTotalHeight + 16 }}>

          <FlatList
            scrollEnabled={false}
            numColumns={1}
            data={ALL_GENRES}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            windowSize={8}
            renderItem={this.renderTile}
            keyExtractor={(item, index) => `${item}-${index}`}
          />

        </ScrollView>
      </Animatable.View>
    )
  }

}
