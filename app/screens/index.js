import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation'
import { Constants } from 'popcorn-sdk'

import i18n from 'modules/i18n'
import colors from 'modules/colors'

import HomeScreen from './Home'
import ItemScreen from './Item'
import PlayerScreen from './Player'
import ModeScreen from './Mode'
import SearchScreen from './Search'

export const AppNavigator = createStackNavigator({
  Main: {
    // screen: HomeScreen,

    screen: createBottomTabNavigator({
      Home: {
        screen           : HomeScreen,
        navigationOptions: {
          tabBarLabel: i18n.t('Home'),
          tabBarIcon : ({ tintColor }) => (
            <Icon
              name={'home'}
              color={tintColor}
              size={25}
            />
          ),
        },
      },

      /*  MyList: {
       screen: ({ ...props }) => <ModeScreen mode={Constants.TYPE_BOOKMARK} {...props} />,

       navigationOptions: {
       tabBarLabel: i18n.t('My List'),
       tabBarIcon : ({ tintColor }) => (
       <Icon
       name={'bookmark'}
       color={tintColor}
       size={25}
       />
       ),
       },
       },
       */
      /* Movies: {
       screen: ({ ...props }) => <ModeScreen mode={Constants.TYPE_MOVIE} {...props} />,

       navigationOptions: {
       tabBarLabel: i18n.t('Movies'),
       tabBarIcon : ({ tintColor }) => (
       <Icon
       name={'movie'}
       color={tintColor}
       size={25}
       />
       ),
       },
       },*/
      /*
       Shows: {
       screen: ({ ...props }) => <ModeScreen mode={Constants.TYPE_SHOW} {...props} />,

       navigationOptions: {
       tabBarLabel: i18n.t('Shows'),
       tabBarIcon : ({ tintColor }) => (
       <Icon
       name={'animation-play'}
       color={tintColor}
       size={25}
       />
       ),
       },
       },

       Search2: {
       screen: SearchScreen,

       navigationOptions: {
       tabBarLabel: i18n.t('Shows'),
       tabBarIcon : ({ tintColor }) => (
       <Icon
       name={'animation-play'}
       color={tintColor}
       size={25}
       />
       ),
       },
       },*/

      Search: {
        screen: SearchScreen,

        navigationOptions: {
          tabBarLabel: i18n.t('Search'),
          tabBarIcon : ({ tintColor }) => (
            <Icon
              name={'magnify'}
              color={tintColor}
              size={25}
            />
          ),
        },
      },
    }, {
      initialRouteName: 'Home',
      tabBarOptions   : {
        inactiveTintColor: '#acacac',
        activeTintColor  : '#FFF',

        style: {
          backgroundColor: colors.BACKGROUND,
        },
      },
    }),
  },

  Item: {
    screen: ItemScreen,
  },

  Player: {
    screen: PlayerScreen,
  },
}, {
  headerMode: 'none',
})


export default createAppContainer(AppNavigator)
