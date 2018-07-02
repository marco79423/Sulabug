import * as React from 'react'

import MainLayout from '../layouts/MainLayout'
import ComicList from '../components/ComicList'

interface PropsTypes {
}

export class BrowsePage extends React.Component<PropsTypes, {}> {
  render() {
    return (
      <MainLayout>
        <ComicList />
      </MainLayout>
    )
  }
}

export default BrowsePage
