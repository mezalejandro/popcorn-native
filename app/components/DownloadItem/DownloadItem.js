import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import { utils } from 'popcorn-sdk'
import * as Progress from 'react-native-progress'

import i18n from 'modules/i18n'
import colors from 'modules/colors'
import withDownloadManager from 'modules/DownloadManager/withDownloadManager'

import IconButton from 'components/IconButton'

export const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
})

export class DownloadItem extends React.Component {

  static propTypes = {
    withTitle: PropTypes.bool,
  }

  static defaultProps = {
    withTitle: false,
  }

  constructor(props) {
    super(props)

    const { downloader, id } = props

    const stream = downloader.getStream(id)

    this.state = {
      progress: stream ? stream.progress : 0,
      state   : stream ? stream.status : null,
    }
  }

  componentDidMount() {
    this.props.downloader.addListener(this.props.id, this.handleProgress)
  }

  componentWillUnmount() {
    this.props.downloader.removeListener(this.props.id, this.handleProgress)
  }

  handleProgress = (data) => {
    console.log('episode.handleProgress', data)

    this.setState({
      state   : data.progress !== 100 ? 'downloading' : 'downloaded',
      progress: parseFloat(data.progress || 0),
    })
  }

  handleDownloadItem = () => {
    const { downloader, torrents, id, progress } = this.props

    if (progress > 99 ) {
      return
    }

    const magnet = utils.getBestTorrent(torrents)

    console.log('download', id, `${id}`)
    downloader.download(magnet.url, id)

    this.setState({
      state   : 'downloading',
      progress: 0,
    })
  }

  renderTitle() {
    const { withTitle } = this.props

    if (withTitle) {
      return i18n.t('Download')
    }
  }

  render() {
    const { state, progress } = this.state

    return (
      <View style={styles.container}>
        {state === 'downloading' && (
          <Progress.Pie
            progress={progress / 100}
            size={36}
            color={'#FFF'}
            borderColor={'#FFF'} />
        )}

        {state !== 'downloading' && (
          <IconButton
            onPress={this.handleDownloadItem}
            name={progress > 99 ? 'check' : 'arrow-collapse-down'}
            color={'#FFF'}
            size={36}>

            {this.renderTitle()}

          </IconButton>
        )}
      </View>
    )
  }

}

export default withDownloadManager(DownloadItem)
