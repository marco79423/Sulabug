import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import DeleteDownloadTaskUseCaseImpl from './DeleteDownloadTaskUseCaseImpl'

describe('DeleteDownloadTaskUseCaseImpl', () => {
  describe('execute', () => {
    it('will delete the download task', async () => {
      const downloadTaskId = 'downloadTaskId'

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const uc = new DeleteDownloadTaskUseCaseImpl(downloadTaskRepository)
      const res = await uc.execute(new Request(downloadTaskId)).toPromise()

      expect(downloadTaskRepository.delete).toBeCalledWith(downloadTaskId)

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
