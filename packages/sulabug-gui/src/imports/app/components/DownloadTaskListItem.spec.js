import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import DownloadTaskListItem from './DownloadTaskListItem'


describe('DownloadTaskListItem', () => {
  it('will render download task correctly', async () => {
    const component = renderer.create(
      <DownloadTaskListItem
        downloadTask={{
          id: 'id',
          name: 'name',
          coverDataUrl: 'coverDataUrl',
          sourceUrl: 'sourceUrl',
          status: 'status',
          progress: 10,
        }}
        deleteDownloadTask={() => {
        }}
      />
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
