import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'
import Settings from './Settings'


describe('Settings', () => {
  it('will render settings correctly', async () => {
    const component = renderer.create(
      <Settings
        updateUserProfile={() => {
        }}
        userProfile={{
          downloadFolderPath: 'downloadFolderPath',
        }}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
