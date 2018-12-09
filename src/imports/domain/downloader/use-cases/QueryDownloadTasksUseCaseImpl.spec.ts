import 'reflect-metadata'

import {Response} from '../../base-types'
import QueryDownloadTasksUseCaseImpl from './QueryDownloadTasksUseCaseImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import DownloadTask from '../entities/DownloadTask'

describe('QueryDownloadTasksUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will get all current download tasks', async () => {
      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTasks = [
        new DownloadTask(
          'id-1',
          'name-1',
          'coverDataUrl',
          'sourceUrl-1',
          downloadTaskRepository
        ),
        new DownloadTask(
          'id-2',
          'name-2',
          'coverDataUrl',
          'sourceUrl-2',
          downloadTaskRepository
        ),
      ]

      downloadTaskRepository.getAll = jest.fn(() => downloadTasks)
      const uc = new QueryDownloadTasksUseCaseImpl(downloadTaskRepository)
      const res = await uc.asyncExecute()

      expect(downloadTaskRepository.getAll).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(downloadTasks.map(downloadTask => downloadTask.serialize()))
    })
  })
})
