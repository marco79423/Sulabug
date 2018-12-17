import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import SearchBar from './SearchBar'


describe('SearchBar', () => {
  it('will render search bar correctly', async () => {
    const component = renderer.create(
      <SearchBar
        searchComic={() => {
        }}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
