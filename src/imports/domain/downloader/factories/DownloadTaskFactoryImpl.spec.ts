import 'reflect-metadata'

import DownloadTaskFactoryImpl from './DownloadTaskFactoryImpl'
import {IDownloadTaskRepository} from '../interfaces'

describe('DownloadTaskFactoryImpl', () => {
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
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        sourceUrl: 'sourceUrl',
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const downloadTask = downloadTaskFactory.createFromJson(jsonData)
      expect(downloadTask.identity).toBe(jsonData.id)
      expect(downloadTask.name).toBe(jsonData.name)
      expect(downloadTask.coverDataUrl).toEqual(jsonData.coverDataUrl)
      expect(downloadTask.sourceUrl).toBe(jsonData.sourceUrl)
    })
  })
})
