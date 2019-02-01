import React from 'react'
import { View, FlatList, StyleSheet } from 'react-native'

import ScrollView from '../searchBarAnimation/ScrollView'
import GenreCard from 'components/GenreCard'

import { ALL_GENRES } from 'modules/genres'

export const styles = StyleSheet.create({

  bottomBar: {
    marginTop: 50,
  },

})

export default class GenresTab extends React.Component {

  renderTile = ({ item: genre }) => (
    <GenreCard title={genre} onPress={() => console.log(this.props)} />
  )

  render() {

    return (
      <ScrollView style={{
        position: 'absolute',
        bottom  : 10,
        right   : 0,
        width   : '100%',
        height  : '100%',
      }}>

        <FlatList
          scrollEnabled={false}
          numColumns={2}
          data={ALL_GENRES}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={8}
          renderItem={this.renderTile}
          keyExtractor={(item, index) => `${item}-${index}`}
        />

        <View style={styles.bottomBar} />

      </ScrollView>
    )
  }

}
