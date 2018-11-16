import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import DeleteDownloadTaskUseCase from './DeleteDownloadTaskUseCase'

describe('DeleteDownloadTaskUseCase', () => {
  describe('asyncExecute', () => {
    it('will delete the download task', async () => {
      const downloadTaskId = 'downloadTaskId'

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const uc = new DeleteDownloadTaskUseCase(downloadTaskRepository)
      const res = await uc.asyncExecute(new Request(downloadTaskId))

      expect(downloadTaskRepository.delete).toBeCalledWith(downloadTaskId)

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
