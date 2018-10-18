import React from 'react'
import TorrentStreamer, { STREAM_STATUS } from 'react-native-torrent-streamer'
import RNFS from 'react-native-fs'

import DownloadManagerContext from './DownloadManagerContext'

export default class DownloadManager extends React.Component {

  torrentStreamer

  torrentStream = null

  listeners = []

  constructor(props) {
    super(props)

    this.torrentStreamer = new TorrentStreamer()

    this.state = {
      streams: [],
    }
  }

  componentWillMount() {
    this.torrentStreamer.addListener('error', this.handleTorrentError)
    this.torrentStreamer.addListener('progress', this.handleTorrentProgress)
    this.torrentStreamer.addListener('ready', this.handleTorrentReady)
  }

  componentWillUnmount() {
    this.torrentStreamer.removeListener(this.handleTorrentError)
    this.torrentStreamer.removeListener(this.handleTorrentProgress)
    this.torrentStreamer.removeListener(this.handleTorrentReady)

    console.log('componentWillUnmount')

    this.torrentStreamer.stopAll()
  }

  handleTorrentError = (e) => {
    console.log('handleTorrentError', e)
  }

  handleTorrentProgress = (data) => {
    if (this.torrentStream && this.torrentStream.onProgress) {
      this.torrentStream.onProgress(data)

    } else {
      const { streams } = this.state

      if (streams.length > 0) {
        const stream = this.getStream(data.id)

        // TODO:: Stop stream when the progress === 100

        // This prevents us from updating the state to often
        if ((stream.progress + 1) < parseFloat(data.progress)) {
          if (this.listeners[data.id] && this.listeners[data.id].length > 0) {
            this.listeners[data.id].forEach(handler => handler(data))
          }

          this.setState({
            streams: streams.map((stream) => {
              if (stream.id === data.id) {
                return {
                  ...stream,
                  progress: parseFloat(data.progress),
                  status  : STREAM_STATUS.downloading,
                }
              }

              return stream
            }),
          })
        }
      } else {
        // We don't have the item so add it
        this.setState({
          streams: [
            {
              id      : data.id,
              status  : STREAM_STATUS.downloading,
              progress: parseFloat(data.progress),
            }],
        })
      }
    }
  }

  handleTorrentReady = (data) => {
    console.log('handleTorrentReady', data)
  }

  download = (magnet, id) => {
    const { streams } = this.state

    this.setState({
      streams: [
        ...streams,
        {
          id      : this.torrentStreamer.add(magnet, id, RNFS.DocumentDirectoryPath, false),
          progress: 0,
          status  : STREAM_STATUS.queued,
        },
      ],
    }, () => {
      this.torrentStreamer.handleStreams()
    })
  }

  getStream = (id) => this.state.streams.find(stream => stream.id === id || stream.id === `${id}`)

  stream = (magnet, location, { onReady = null, onStatus = null, onProgress = null, onError = null }) => {
    this.torrentStream = {
      id: this.torrentStreamer.add(magnet, null, location, true),

      onReady,
      onStatus,
      onProgress,
      onError,
    }

    this.torrentStreamer.handleStreams(this.torrentStream.id)
  }

  stopStream = () => {
    console.log('stopStream', this.torrentStream)
    if (this.torrentStream) {
      this.torrentStreamer.stopStream(this.torrentStream.id)
    }
  }

  getValue = () => {
    const { streams } = this.state

    return {
      streams,
      getStream: this.getStream,

      stream    : this.stream,
      stopStream: this.stopStream,
      download  : this.download,

      addListener: (id, handler) => {
        if (!this.listeners[id]) {
          this.listeners[id] = []
        }

        this.listeners[id].push(handler)
      },

      removeListener: (id, registerdHandler) => {
        this.listeners[id] = this.listeners[id].filter(handler => handler !== registerdHandler)
      },
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
