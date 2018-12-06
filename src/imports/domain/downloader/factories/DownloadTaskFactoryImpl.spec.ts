import 'reflect-metadata'

import DownloadTaskFactoryImpl from './DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'

describe('DownloadTaskFactoryImpl', () => {
  describe('createFromJson', () => {
    it('will generate a new DownloadTask instance from json data', () => {
      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const jsonData = {
        id: 'id',
        name: 'name',
        coverImage: {
          id: 'id',
          comicInfoId: 'comicInfoId',
          mediaType: 'mediaType',
          base64Content: 'base64Content',
        },
        sourceUrl: 'sourceUrl',
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const downloadTask = downloadTaskFactory.createFromJson(jsonData)
      expect(downloadTask.identity).toBe(jsonData.id)
      expect(downloadTask.name).toBe(jsonData.name)
      expect(downloadTask.coverImage).toEqual(jsonData.coverImage)
      expect(downloadTask.sourceUrl).toBe(jsonData.sourceUrl)
    })
  })
})
