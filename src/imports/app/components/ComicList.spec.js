import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import ComicList from './ComicList'


describe('ComicList', () => {
  it('will render comic list correctly', async () => {
    const component = renderer.create(
      <ComicList loading={false}
                 comics={[]}
                 createDownloadTask={() => {
                 }}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('will render comic list correctly in loading state', async () => {
    const component = renderer.create(
      <ComicList loading={true}
                 comics={[]}
                 createDownloadTask={() => {
                 }}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
