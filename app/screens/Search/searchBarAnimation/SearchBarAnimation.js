import { Animated } from 'react-native'
import SearchBar from '../SearchBar'

export default class SearchBarAnimation {

  clampedScrollValue = 0
  scrollValue = 0
  initialState = null
  statusBarStyle = null
  statusBarHeight = 20 // Height of the status bar
  topPartHeight = SearchBar.searchTextHeight - this.statusBarHeight

  fullHeight = SearchBar.searchTextHeight + SearchBar.searchInputTotalHeight // = 222

  maxClamp = this.fullHeight - SearchBar.searchInputTotalHeight - this.statusBarHeight // remove after first - for out of screen
  minClamp = this.topPartHeight
  diffClamp = this.maxClamp - this.minClamp

  initialScroll = 0

  actionAnimated = new Animated.Value(0)
  scrollY = new Animated.Value(this.initialScroll)

  previousScroll = 0

  constructor() {
    this._createClampedScroll()
    this.scrollY.addListener(this._updateScroll)
  }

  destroy() {
    this.scrollY.removeAllListeners()
  }

  _updateScroll = ({ value, manually }) => {
    if (value && manually) {
      this.clampedScrollValue = value

    } else {
      const diff = value - this.scrollValue

      this.scrollValue = Math.max(value, this.topPartHeight) // Fix normal state
      this.clampedScrollValue = Math.min(
        Math.max(this.clampedScrollValue + diff, this.minClamp),
        this.maxClamp,
      )
    }
  }

  _createClampedScroll() {
    this.clampedScroll = Animated.diffClamp(
      this.scrollY.interpolate({ // Only positive
        inputRange     : [0, 1],
        outputRange    : [0, 1],
        extrapolateLeft: 'clamp',

      }).interpolate({ // Fix normal state
        inputRange : [0, this.topPartHeight],
        outputRange: [this.topPartHeight, this.topPartHeight],
        extrapolate: 'identity',
      }),

      this.minClamp,
      this.maxClamp,
    )
  }

  handleSearchChange = (searching) => {
    let offset = searching
      ? this.topPartHeight
      : this.previousScroll

    this.previousScroll = this.scrollY._value

    this.scrollY.setValue(offset)
    this._createClampedScroll()
  }

  animationProps = {
    initialScroll: this.initialScroll,
    scrollY      : this.scrollY,
    topPartHeight: this.topPartHeight,
    fullHeight   : this.fullHeight,
  }

  getTransformWrapper() {
    const byScroll = Animated.add(
      Animated.multiply(this.clampedScroll, -1),

      this.scrollY.interpolate({ // To negative
        inputRange : [0, 1],
        outputRange: [0, -1],

      }).interpolate({ // Add bottom height part
        inputRange : [-this.topPartHeight, 0],
        outputRange: [0, this.minClamp],
        extrapolate: 'clamp',
      }),
    )

    return {
      transform: [
        {
          translateY: Animated.add(byScroll, this.actionAnimated),
        },
      ],
    }
  }

  getTransformSearchBar() {
    return {
      transform: [
        {
          translateY: Animated.add(
            this.actionAnimated.interpolate({
              inputRange : [0, 1],
              outputRange: [0, -1],
              extrapolate: 'clamp',
            }),

            this.scrollY.interpolate({
              inputRange : [0, this.topPartHeight],
              outputRange: [0, this.topPartHeight - 53], // the - 53 gives the text a parallax effect
              extrapolate: 'clamp',
            })),
        },
      ],
    }
  }

}
