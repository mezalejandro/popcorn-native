import React from 'react'
import TorrentStreamer, { STREAM_STATUS } from 'react-native-torrent-streamer'
import RNFS from 'react-native-fs'

import DownloadsDB from 'modules/db/Downloads'
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

  async componentWillMount() {
    this.torrentStreamer.addListener('error', this.handleTorrentError)
    this.torrentStreamer.addListener('progress', this.handleTorrentProgress)
    this.torrentStreamer.addListener('ready', this.handleTorrentReady)

    const downloads = await DownloadsDB.getAll()

    this.setState({
      streams: downloads,
    }, () => {
      downloads.forEach(download => {
        if (!download.magnet || download.progress === 100) {
          return
        }

        console.log('add', download)
        this.torrentStreamer.add(
          download.magnet,
          download.id,
          download.location,
          download.removeAfterStop,
        )
      })

      if (downloads.length > 0) {
        this.torrentStreamer.handleStreams()
      }
    })
  }

  componentWillUnmount() {
    this.torrentStreamer.removeListener(this.handleTorrentError)
    this.torrentStreamer.removeListener(this.handleTorrentProgress)
    this.torrentStreamer.removeListener(this.handleTorrentReady)

    console.log('componentWillUnmount', 'download manager')

    this.torrentStreamer.stopAll()
  }

  handleTorrentError = (e) => {
    console.log('handleTorrentError', e)
  }

  handleTorrentProgress = (data) => {
    const { streams } = this.state

    if (streams.length > 0) {
      const stream = this.getStream(data.id)

      data.progress = parseFloat(data.progress)

      // This prevents us from updating the state to often
      if ((stream.progress + 0.20) < data.progress && data.progress < 99) {
        if (this.listeners[data.id] && this.listeners[data.id].length > 0) {
          this.listeners[data.id].forEach(handler => handler(data))
        }

        this.updateStream(data.id, {
          progress: data.progress,
          buffer  : parseFloat(data.buffer),
          status  : STREAM_STATUS.downloading,
        })

      } else if (data.progress > 99) {
        console.log('download manager > 99', data)
        if (this.listeners[data.id] && this.listeners[data.id].length > 0) {
          this.listeners[data.id].forEach(handler => handler({
            ...data,
            progress: 100,
          }))
        }

        this.updateStream(data.id, {
          progress: 100,
          status  : STREAM_STATUS.downloaded,
        }, () => {
          this.stopStream(data.id)
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
            buffer  : parseFloat(data.buffer),
          },
        ],
      })
    }
  }

  handleTorrentReady = (data) => {
    console.log('Download manager', 'handleTorrentReady', data)
    this.updateStream(data.id, data)

    if (this.torrentStream && this.torrentStream.onReady) {
      this.torrentStream.onReady(data)
    }
  }

  download = (magnet, id) => {
    const { streams } = this.state

    if (this.getStream(id)) {
      return null
    }

    const item = {
      id      : this.torrentStreamer.add(magnet, id, RNFS.DocumentDirectoryPath, false),
      progress: 0,
      status  : STREAM_STATUS.queued,
    }

    this.setState({
      streams: [
        ...streams,
        item,
      ],
    }, () => {
      DownloadsDB.addItem({
        ...item,
        magnet,
        location       : RNFS.DocumentDirectoryPath,
        removeAfterStop: false,
      })

      this.torrentStreamer.handleStreams()
    })
  }

  getStream = (id) => this.state.streams.find(stream => stream.id === id || stream.id === `${id}`)

  updateStream = (id, newStream, callback = null) => {
    const { streams } = this.state

    this.setState({
      streams: streams.map((stream) => {
        if (stream.id === id) {
          const nStream = {
            ...stream,
            ...newStream,
          }

          DownloadsDB.updateItem(nStream)

          return nStream
        }

        return stream
      }),
    }, callback)
  }

  stream = (magnet, id, location, { onReady = null, onError = null }) => {
    // Pause everything
    this.torrentStreamer.pauseAll()

    const stream = this.getStream(id)
    console.log('stream', id, stream, this.state.streams)

    if (stream) {
      this.torrentStream = {
        ...stream,

        onError,
        onReady,
      }

      if (stream.progress < 99 && stream.status !== STREAM_STATUS.downloading) {
        this.torrentStreamer.handleStreams(id)

      } else {
        if (stream.buffer === 100) {
          this.torrentStream.onReady(stream)
        }
      }

    } else {
      const { streams } = this.state

      this.torrentStream = {
        id: this.torrentStreamer.add(magnet, id, location, true),

        onReady,
        onError,
      }

      this.setState({
        streams: [
          ...streams,
          {
            id,
            progress: 0,
            status  : STREAM_STATUS.queued,
          },
        ],
      }, () => {
        this.torrentStreamer.handleStreams(this.torrentStream.id)
      })
    }
  }

  stopStream = (streamId) => {
    console.log('DownloadManager', 'stopStream', streamId)

    const { streams } = this.state

    const stream = this.getStream(streamId)

    if (stream.status === STREAM_STATUS.downloading) {
      this.torrentStreamer.stopStream(streamId)
    }

    if (this.torrentStream && this.torrentStream.id === streamId) {
      this.torrentStream = null
    }

    if (stream.removeAfterStop) {
      this.setState({
        streams: streams.filter(stream => stream.id !== streamId)
      })
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
console.log('addListener', id)
        this.listeners[id].push(handler)
      },

      removeListener: (id, registerdHandler) => {
        console.log('removeListener', id)
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
