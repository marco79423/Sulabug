import * as React from 'react'

import MainLayout from '../layouts/MainLayout'
import DownloadTaskList from '../components/DownloadTaskList'

interface PropsTypes {
}

export class DownloadPage extends React.Component<PropsTypes, {}> {
  render() {

    const downloadTasks = [
      {
        id: 1,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        name: 'Name1',

        status: 'downloading',
        progress: 80,
      },
      {
        id: 2,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        name: 'Name1',

        status: 'preparing',
        progress: 0,
      },
      {
        id: 3,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        name: 'Name1',

        status: 'waiting',
        progress: 0,
      },
    ]

    return (
      <MainLayout>
        <DownloadTaskList downloadTasks={downloadTasks}/>
      </MainLayout>
    )
  }
}

export default DownloadPage
