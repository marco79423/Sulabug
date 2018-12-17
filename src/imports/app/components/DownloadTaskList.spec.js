import 'reflect-metadata'

import React from 'react'
import renderer from 'react-test-renderer'

import DownloadTaskList from './DownloadTaskList'


describe('DownloadTaskList', () => {
  it('will render download task list correctly', async () => {
    const component = renderer.create(
      <DownloadTaskList loading={false}
                        downloadTasks={[]}
                        deleteDownloadTask={() => {
                        }}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })

  it('will render download task list correctly in loading state', async () => {
    const component = renderer.create(
      <DownloadTaskList loading={true}
                        downloadTasks={[]}
                        deleteDownloadTask={() => {
                        }}/>
    )
    expect(component.toJSON()).toMatchSnapshot()
  })
})
