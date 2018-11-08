import * as React from 'react'

import MainLayout from '../layouts/MainLayout'
import DownloadList from '../components/DownloadList'

interface PropsTypes {
}

export class DownloadPage extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <DownloadList/>
      </MainLayout>
    )
  }
}

export default DownloadPage
