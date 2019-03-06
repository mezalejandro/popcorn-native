import RNFS from 'react-native-fs'
import * as wrtc from 'react-native-webrtc'

import WebTorrent from 'webtorrent'

export default class TorrentManager {

  client

  server

  serverPort

  loadedItem

  loadedMagnet

  constructor() {
    const createTorrent = require('create-torrent')

    global.WEBTORRENT_ANNOUNCE = createTorrent.announceList
      .map(arr => arr[0])
      .filter(url => url.indexOf('wss://') === 0 || url.indexOf('ws://') === 0)

    global.WRTC = wrtc

    // const WebTorrent = require('webtorrent')
    this.client = new WebTorrent()


    console.log('window', window)
    console.log('this.client', this.client)
  }

  start = (magnet, item) => {
    this.loadedItem = item
    this.loadedMagnet = magnet

    const supportedFormats = [
      'mp4',
      'ogg',
      'mov',
      'webmv',
      'mkv',
      'wmv',
      'avi',
    ]

    console.log('this.client.add')
    this.client.add(
      magnet,
      {
        path: RNFS.CachesDirectoryPath,
      },
      torrent => this.createServer(torrent).then(() => {
        console.log('torrent', torrent)
        const { files } = torrent

        const { file, torrentIndex } = files.reduce((previous, current, index) => {
          const formatIsSupported = !!supportedFormats.find(format => current.name.includes(format))

          if (formatIsSupported) {
            if (previous !== 'undefined' && current.length > previous.file.length) {
              previous.file.deselect()

              return {
                file        : current,
                torrentIndex: index,
              }
            }
          }

          return previous

        }, { file: files[0], torrentIndex: 0 })

        if (typeof torrentIndex !== 'number') {
          throw new Error(`No torrent could be selected. Torrent Index: ${torrentIndex}`)
        }

        file.select()

        this.checkBufferInterval = this.bufferInterval({ torrent, torrentIndex, fileName: file.name })
      }))
  }

  bufferInterval = ({ torrent, torrentIndex, fileName }) => setInterval(() => {
    const toBuffer = (1024 * 1024) * 25

    if (torrent.downloaded > toBuffer) {
      console.log('torrent update', {
        item: this.loadedItem,
        uri : `http://localhost:${this.serverPort}/${torrentIndex}/${fileName}`,
      })

      this.clearIntervals()

    } else {
      console.log('torrent buffering', {
        progress     : torrent.downloaded / toBuffer,
        timeRemaining: ((toBuffer - torrent.downloaded) / torrent.downloadSpeed) * 1000,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed  : torrent.uploadSpeed,
        peers        : torrent.numPeers,
      })
    }

  }, 1000)

  createServer = torrent => new Promise((resolve) => {
    console.log('createServer for ', torrent)
    if (this.server) {
      return resolve()
    }

    this.server = true // torrent.createServer()
    // this.serverPort = port
    // this.server.listen(9091)

    resolve()
  })

  clearIntervals = () => {
    if (this.checkBufferInterval) {
      clearInterval(this.checkBufferInterval)
    }

    // if (this.checkDownloadInterval) {
    //   clearInterval(this.checkDownloadInterval)
    // }
  }

  destroy = () => {

  }

}
