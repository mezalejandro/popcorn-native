import React from 'react'
import { View, StyleSheet, TextInput, Animated, Dimensions, BackHandler } from 'react-native'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

import BaseButton from 'components/BaseButton'
import Typography from 'components/Typography'
import colors from 'modules/colors'
import i18n from 'modules/i18n'

const { width } = Dimensions.get('window')

export default class SearchBar extends React.Component {

  static searchTextHeight = 200
  static searchInputTotalHeight = 61
  static searchInputInputHeight = 45

  inputRef

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    const { searching } = this.props

    if (searching) {
      this.handleCancelSearch()
    }

    return searching
  }

  handleInputRef = (ref) => {
    this.inputRef = ref

    this.inputRef.focus()
  }

  handleGoSearch = () => {
    const { goSearch } = this.props

    goSearch()
  }

  handleCancelSearch = () => {
    const { cancelSearch } = this.props

    this.inputRef.blur()

    cancelSearch()
  }

  render() {
    const { animation, searching } = this.props

    const transformWrapper = animation.getTransformWrapper()
    const transformSearchBar = animation.getTransformSearchBar()

    return (
      <Animated.View style={[styles.wrapper, transformWrapper]}>

        <View style={styles.mainTextContainer}>
          <Animated.View style={[transformSearchBar]}>
            <Typography
              color={'white'}
              style={styles.mainText}
              variant={'display1'}
              fontWeight={'bold'}>
              Search
            </Typography>
          </Animated.View>
        </View>

        <View style={styles.searchContainer}>

          {searching && (
            <View style={styles.searchRoot}>

              <View style={[styles.searchInputContainer, styles.searchContainerMargins]}>

                <Icon
                  style={styles.searchIcon}
                  name={'magnify'}
                  color={'#FFF'}
                  size={32}
                />

                <TextInput
                  ref={this.handleInputRef}
                  style={styles.input}
                  selectionColor={'#FFF'}
                  underlineColorAndroid={'transparent'}
                  onChangeText={() => {}}
                  onSubmitEditing={() => console.log('search')}
                />

              </View>

            </View>
          )}

          {!searching && (
            <BaseButton onPress={this.handleGoSearch}>
              <View style={[styles.goSearchButton, styles.searchContainerMargins]}>
                <Icon
                  name={'magnify'}
                  color={'#000'}
                  size={25}
                />

                <Typography
                  variant={'subheading'}
                  color={'black'}
                  style={styles.goSearchText}>
                  {i18n.t('Movies or shows')}
                </Typography>
              </View>
            </BaseButton>
          )}

        </View>

      </Animated.View>
    )
  }
}


const styles = StyleSheet.create({

  wrapper: {
    position: 'absolute',
    top     : 0,
    left    : 0,
    right   : 0,
    zIndex  : 1,

    backgroundColor: colors.BACKGROUND,
  },

  mainTextContainer: {
    zIndex  : 99,
    width   : '100%',
    overflow: 'hidden',

    display       : 'flex',
    justifyContent: 'flex-end',
    alignItems    : 'center',
    alignContent  : 'center',

    height: SearchBar.searchTextHeight,
  },

  mainText: {
    position    : 'relative',
    marginBottom: 42,
  },

  searchContainer: {
    display : 'flex',
    position: 'relative',

    height: SearchBar.searchInputTotalHeight,
  },

  searchContainerMargins: {
    marginLeft  : 8,
    marginRight : 8,
    marginTop   : 8,
    marginBottom: 8,
  },

  goSearchButton: {
    backgroundColor: 'white',
    height         : SearchBar.searchInputInputHeight,
    borderRadius   : 3,

    display       : 'flex',
    textAlign     : 'center',
    justifyContent: 'center',
    alignItems    : 'center',
    alignContent  : 'center',
    flexDirection : 'row',
  },

  goSearchText: {
    marginLeft: 8,

    ...Typography.getTextStyle({
      variant   : 'body2',
      fontWeight: 'medium',
      asObject  : true,
    }),

    color: 'black',
  },

  searchTextContainer: {
    display       : 'flex',
    textAlign     : 'center',
    justifyContent: 'center',
    alignItems    : 'center',
    alignContent  : 'center',
    flexDirection : 'row',
  },

  searchRoot: {
    width         : '100%',
    margin        : 0,
    display       : 'flex',
    justifyContent: 'center',
    alignItems    : 'center',
  },

  searchInputContainer: {
    position       : 'relative',
    backgroundColor: colors.BACKGROUND_LIGHTER,
    width          : width - 16,
    height         : SearchBar.searchInputInputHeight,
    borderRadius   : 3,
    display        : 'flex',
    flexDirection  : 'row',
    justifyContent : 'center',
    alignItems     : 'center',
  },

  input: {
    height     : '100%',
    flex       : 1,
    color      : '#FFF',
    margin     : 0,
    marginRight: 8,
  },

  searchIcon: {
    marginLeft : 8,
    marginRight: 8,
  },

})
