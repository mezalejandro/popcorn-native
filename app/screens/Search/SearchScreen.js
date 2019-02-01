import React from 'react'
import { StyleSheet, Dimensions, View, StatusBar } from 'react-native'
import { withNavigationFocus } from 'react-navigation'

import colors from 'modules/colors'

import { SearchBarProvider } from './searchBarAnimation'
import SearchBar from './SearchBar'

import GenresTab from './GenresTab'
import SearchTab from './SearchTab'

const styles = StyleSheet.create({

  container: {
    flex           : 1,
    backgroundColor: colors.BACKGROUND,
  },

  fullWidth: {
    width : Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
})


export class Search extends React.Component {

  static getDerivedStateFromProps(props, state) {
    const { isFocused } = props

    if (!isFocused && state.searching) {
      return {
        searching: false,
      }
    }

    return {}
  }

  state = {
    searching: false,
  }

  handleGoSearch = (animation) => () => {
    animation.handleSearchChange(true)

    this.setState({
      searching: true,
    })
  }

  handleCancelSearch = (animation) => () => {
    animation.handleSearchChange(false)

    this.setState({
      searching: false,
    })
  }

  render() {
    const { searching } = this.state

    return (
      <SearchBarProvider>
        {(animation) => (
          <View style={styles.fullWidth}>
            <StatusBar
              translucent={true}
              backgroundColor="transparent"
            />

            <View style={styles.container}>
              <SearchBar
                animation={animation}
                searching={searching}
                cancelSearch={this.handleCancelSearch(animation)}
                goSearch={this.handleGoSearch(animation)}
              />

              <GenresTab />

              <SearchTab
                containerStyle={styles.fullWidth}
                animation={animation}
                searching={searching} />

            </View>

          </View>
        )}
      </SearchBarProvider>
    )
  }
}

export default withNavigationFocus(Search)
