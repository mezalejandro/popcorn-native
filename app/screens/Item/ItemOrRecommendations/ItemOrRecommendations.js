import React from 'react'
import { View, StyleSheet } from 'react-native'
import * as Animatable from 'react-native-animatable'

import i18n from 'modules/i18n'
import colors from 'modules/colors'
import dimensions from 'modules/dimensions'

import TextButton from 'components/TextButton'

import SeasonsAndEpisodes from './SeasonsAndEpisodes'
import Recommendations from './Recommendations'

export const styles = StyleSheet.create({

  buttonContainer: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    display       : 'flex',
    flexDirection : 'row',
    width         : '100%',
  },

  buttons: {
    marginRight : dimensions.UNIT,
    paddingLeft : dimensions.UNIT * 2,
    paddingRight: dimensions.UNIT * 2,
    paddingTop  : dimensions.UNIT * 2,
    marginBottom: dimensions.UNIT * 2,
  },

  buttonActive: {
    borderTopWidth: 2,
    borderTopColor: colors.ITEM_ACTIVE_TAB_INDICATOR,
  },

})

export default class ItemOrRecommendations extends React.PureComponent {

  static propTypes = {}

  static defaultProps = {}

  state = {
    recommendationActive: false,
    recommendations     : [],
  }

  handleViewRecommendation = (recommendationActive) => {
    this.setState({
      recommendationActive,
    })
  }

  handleFetchedRecommendations = (recommendations) => {
    this.setState({
      recommendations,
    })
  }

  getStyles = (isRecommendation) => {
    const { recommendationActive } = this.state

    const buttonStyles = [styles.buttons]

    if (isRecommendation && recommendationActive || !isRecommendation && !recommendationActive) {
      buttonStyles.push(styles.buttonActive)
    }

    return buttonStyles
  }

  render() {
    const { item, getItem } = this.props
    const { recommendationActive, recommendations } = this.state

    return (
      <Animatable.View animation={'fadeIn'} useNativeDriver>
        <View style={styles.buttonContainer}>
          <TextButton
            onPress={() => this.handleViewRecommendation(false)}
            emphasis={recommendationActive ? 'medium' : 'high'}
            style={this.getStyles(false)}>
            {i18n.t('Episodes')}
          </TextButton>

          <TextButton
            onPress={() => this.handleViewRecommendation(true)}
            emphasis={recommendationActive ? 'high' : 'medium'}
            style={this.getStyles(true)}>
            {i18n.t('More like this')}
          </TextButton>
        </View>

        {!recommendationActive && (
          <SeasonsAndEpisodes
            item={item}
          />
        )}

        {recommendationActive && (
          <Recommendations
            onFetchedRecommendations={this.handleFetchedRecommendations}
            recommendations={recommendations}
            item={item}
            getItem={getItem} />
        )}

      </Animatable.View>
    )
  }

}
