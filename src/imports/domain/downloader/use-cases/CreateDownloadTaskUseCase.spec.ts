import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import CreateDownloadTaskUseCase from './CreateDownloadTaskUseCase'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'

describe('CreateDownloadTaskUseCase', () => {
  describe('asyncExecute', () => {
    it('will create a download task', async () => {
      const comicInfoId = 'comicInfoId'

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const uc = new CreateDownloadTaskUseCase(downloadTaskFactory, downloadTaskRepository)
      const res = await uc.asyncExecute(new Request(comicInfoId))

      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTaskFactory.createFromJson({
        id: comicInfoId,
        comicInfoId: comicInfoId,
      }))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
