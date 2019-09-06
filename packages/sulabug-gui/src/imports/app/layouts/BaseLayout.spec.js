import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'
import BaseLayout from './BaseLayout'
import {MemoryRouter} from 'react-router-dom'


describe('BaseLayout', () => {
  it('will render layout correctly', async () => {
    const component = renderer.create(
      <MemoryRouter>
        <BaseLayout searchComic={() => {
        }}>
          hello world
        </BaseLayout>
      </MemoryRouter>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
