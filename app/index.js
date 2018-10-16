import React from 'react'
import { Provider } from 'react-redux'

import Disclaimer from 'components/Disclaimer'
import CheckForUpdates from 'components/CheckForUpdates'

import DownloadManager from 'modules/DownloadManager'

import store from './store'
import Screens from './screens'

export default () => (
  <Provider store={store}>
    <Disclaimer>

      <DownloadManager>
        <Screens />
      </DownloadManager>

      <CheckForUpdates />
    </Disclaimer>
  </Provider>
)
