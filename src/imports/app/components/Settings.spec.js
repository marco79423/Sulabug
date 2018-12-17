import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'
import Settings from './Settings'


describe('Settings', () => {
  it('will render settings correctly', async () => {
    const component = renderer.create(
      <Settings
        updateConfig={() => {
        }}
        config={{
          downloadFolderPath: 'downloadFolderPath',
          comicInfoDatabasePath: 'comicInfoDatabasePath',
        }}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
