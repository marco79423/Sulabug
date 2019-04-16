import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import ComicList from './ComicList'


describe('ComicList', () => {
  it('will render comic list correctly', async () => {
    const component = renderer.create(
      <ComicList loading={false}
                 userProfile={{
                   databaseUpdatedTime: '2019-01-01T00:00:00.000Z',
                 }}
                 comics={[]}
                 addComicToCollection={() => {}}
                 updateComicInfoDatabase={() => {}}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('will render comic list correctly in loading state', async () => {
    const component = renderer.create(
      <ComicList loading={true}
                 comics={[]}
                 userProfile={undefined}
                 addComicToCollection={() => {
                 }}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
