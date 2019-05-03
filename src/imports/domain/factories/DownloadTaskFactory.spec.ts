import 'reflect-metadata'

import DownloadTaskFactory from './DownloadTaskFactory'
import {IDownloadTaskRepository} from '../interfaces'

describe('DownloadTaskFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new DownloadTask instance from json data', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const jsonData = {
        id: 'id',
        comicId: 'comicId',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        sourceUrl: 'sourceUrl',
      }

      const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)
      const downloadTask = downloadTaskFactory.createFromJson(jsonData)
      expect(downloadTask.identity).toBe(jsonData.id)
      expect(downloadTask.comicIdentity).toBe(jsonData.comicId)
      expect(downloadTask.name).toBe(jsonData.name)
      expect(downloadTask.coverDataUrl).toEqual(jsonData.coverDataUrl)
    })
  })
})
