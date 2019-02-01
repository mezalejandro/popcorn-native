import React from 'react'
import SearchBarAnimation from './SearchBarAnimation'
import { SearchBarContext } from './SearchBarContext'

export default class SearchBarProvider extends React.Component {

  constructor(props) {
    super(props)

    this.searchBarAnimation = new SearchBarAnimation()

    this.state = {
      animation: this.searchBarAnimation.animationProps,
    }
  }

  componentWillUnmount() {
    this.searchBarAnimation.destroy()
  }

  render() {
    return (
      <SearchBarContext.Provider value={this.state}>

        {this.props.children(this.searchBarAnimation)}

      </SearchBarContext.Provider>
    )
  }
}
