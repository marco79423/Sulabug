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
        comicInfoId: 'comicInfoId',
      }

      const coverImageFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const coverImage = coverImageFactory.createFromJson(jsonData)
      expect(coverImage.identity).toBe(jsonData.id)
      expect(coverImage.comicInfoIdentity).toBe(jsonData.comicInfoId)
    })
  })
})
