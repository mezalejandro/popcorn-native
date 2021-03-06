import { StatusBar } from 'react-native'

export default {
  currentActiveBackgroundColor : 'rgba(0, 0, 0, 0)',
  previousActiveBackgroundColor: 'rgba(0, 0, 0, 0)',

  update: (newColor) => {
    this.previousActiveBackgroundColor = this.currentActiveBackgroundColor
    this.currentActiveBackgroundColor = newColor

    StatusBar.setBackgroundColor(this.currentActiveBackgroundColor, true)
  },
}
