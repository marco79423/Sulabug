import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'
import BaseLayout from './BaseLayout'


describe('BaseLayout', () => {
  it('will render layout correctly', async () => {
    const component = renderer.create(
      <BaseLayout
        searchComic={() => {}}
        changeCurrentPage={() => {}}
      >
        hello world
      </BaseLayout>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
