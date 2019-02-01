import React from 'react'
import { ScrollView as RNScrollView, Animated } from 'react-native'
import { SearchBarContext } from './SearchBarContext'

const AnimatedScrollView = Animated.createAnimatedComponent(RNScrollView)

class ScrollView extends React.PureComponent {

  static defaultProps = {
    withOnScroll: true,
  }

  render() {
    const { scrollY, fullHeight } = this.props.animation
    const { withOnScroll, contentContainerStyle, children } = this.props

    return (
      <AnimatedScrollView
        {...this.props}
        scrollEventThrottle={1}
        contentContainerStyle={[
          { paddingTop: fullHeight },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onScroll={withOnScroll
          ? Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true },
          )
          : null
        }>
        {children}
      </AnimatedScrollView>
    )
  }
}

// HOC
const withSearchBarContext = Comp => props => (
  <SearchBarContext.Consumer>
    {(context) =>
      <Comp
        {...context}
        {...props}
      />
    }
  </SearchBarContext.Consumer>
)

export default withSearchBarContext(ScrollView)
