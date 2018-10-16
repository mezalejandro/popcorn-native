import React from 'react'
import PropTypes from 'prop-types'
import TorrentStreamer from 'react-native-torrent-streamer'

import DownloadManagerContext from './DownloadManagerContext'

export default class DownloadManager extends React.Component {

  static propTypes = {}

  static defaultProps = {}

  torrentStreamer

  torrentStream = null

  constructor(props) {
    super(props)

    this.torrentStreamer = new TorrentStreamer()
  }

  componentWillMount() {
    this.torrentStreamer.addGlobalListener('error', this.handleTorrentError)
    this.torrentStreamer.addGlobalListener('progress', this.handleTorrentProgress)
    this.torrentStreamer.addGlobalListener('ready', this.handleTorrentReady)
  }

  componentWillUnmount() {
    this.torrentStreamer.removeGlobalListener(this.handleTorrentError)
    this.torrentStreamer.removeGlobalListener(this.handleTorrentProgress)
    this.torrentStreamer.removeGlobalListener(this.handleTorrentReady)

    console.log('componentWillUnmount')

    this.torrentStreamer.stopAll()
  }

  handleTorrentError = () => {

  }

  handleTorrentProgress = (data) => {
    console.log('handleTorrentProgress', data)

    if (this.torrentStream && this.torrentStream.onProgress) {
      this.torrentStream.onProgress(data)
    }
  }

  handleTorrentReady = (data) => {
    console.log('handleTorrentStatus', data)
  }

  download = (magnet) => {
    console.log('download')
  }

  stream = (magnet, location, { onReady = null, onStatus = null, onProgress = null, onError = null }) => {
    console.log('stream')

    this.torrentStream = {
      id: this.torrentStreamer.add(magnet, null, location, true),

      onReady,
      onStatus,
      onProgress,
      onError
    }

    console.log('this.torrentStream', this.torrentStream)
    this.torrentStreamer.handleStreams(this.torrentStream.id)
  }

  stopStream = () => {
    console.log('stopStream', this.torrentStream)
    if (this.torrentStream) {
      this.torrentStreamer.stopStream(this.torrentStream.id)
    }
  }

  getValue = () => {
    return {
      stream    : this.stream,
      stopStream: this.stopStream,
      download  : this.download,
    }
  }

  render() {
    const { children } = this.props

    return (
      <DownloadManagerContext.Provider value={this.getValue()}>
        {children}
      </DownloadManagerContext.Provider>
    )
  }

}
