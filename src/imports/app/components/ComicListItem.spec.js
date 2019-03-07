import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import ComicListItem from './ComicListItem'


describe('ComicListItem', () => {
  it('will render comic item correctly', async () => {
    const component = renderer.create(
      <ComicListItem
        comic={{
          id: 'id',
          name: 'name',
          coverDataUrl: 'coverDataUrl',
          source: 'source',
          pageUrl: 'pageUrl',
          catalog: 'catalog',
          author: 'author',
          lastUpdatedChapter: 'lastUpdatedChapter',
          lastUpdatedTime: new Date('2019-01-16T00:00:00.000Z'),
          summary: 'summary',
        }}
        createDownloadTask={() => {
        }}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
