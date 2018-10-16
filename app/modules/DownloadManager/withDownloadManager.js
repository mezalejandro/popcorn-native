import React from 'react'
import DownloadManagerContext from './DownloadManagerContext'

export default Component => (props) => (
  <DownloadManagerContext.Consumer>
    {downloader => <Component {...props} downloader={downloader}/>}
  </DownloadManagerContext.Consumer>
)
