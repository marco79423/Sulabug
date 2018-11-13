import * as React from 'react'

import MainLayout from '../layouts/MainLayout'
import ComicList from '../components/ComicList'

interface PropsTypes {
}

export class BrowsePage extends React.Component<PropsTypes, {}> {
  render() {

    const comics = [
      {
        id: 1,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        source: 'SF',
        name: 'Name1',
        catalog: 'Catalog',
        author: 'Author',
        lastUpdated: 'Last Update',
      },
      {
        id: 2,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        source: 'SF',
        name: 'Name2',
        catalog: 'Catalog',
        author: 'Author',
        lastUpdated: 'Last Update',
      },
      {
        id: 3,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        source: 'SF',
        name: 'Name3',
        catalog: 'Catalog',
        author: 'Author',
        lastUpdated: 'Last Update',
      },
      {
        id: 4,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        source: 'SF',
        name: 'Name4',
        catalog: 'Catalog',
        author: 'Author',
        lastUpdated: 'Last Update',
      },
      {
        id: 5,
        coverUrl: 'http://rs.sfacg.com/web/novel/images/NovelCover/Small/2017/01/bfb9f16b-bcff-4604-95d3-435d629c20d2.jpg',
        source: 'SF',
        name: 'Name5',
        catalog: 'Catalog',
        author: 'Author',
        lastUpdated: 'Last Update',
      },
    ]


    return (
      <MainLayout>
        <ComicList comics={comics}/>
      </MainLayout>
    )
  }
}

export default BrowsePage
