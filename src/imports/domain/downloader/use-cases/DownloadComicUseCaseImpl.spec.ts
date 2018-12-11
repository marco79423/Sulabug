import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {SFComicDownloadAdapter} from '../interfaces/adapters'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import DownloadComicUseCaseImpl from './DownloadComicUseCaseImpl'

describe('DownloadComicUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will download target comic', async () => {
      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const downloadTask = downloadTaskFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        sourceUrl: 'sourceUrl',
      })
      downloadTaskRepository.getById = jest.fn(() => downloadTask)

      const sfComicDownloadAdapter: SFComicDownloadAdapter = {
        asyncDownload: jest.fn(),
      }

      const uc = new DownloadComicUseCaseImpl(sfComicDownloadAdapter, downloadTaskRepository)
      const res = await uc.asyncExecute(new Request(downloadTask.identity))

      expect(downloadTaskRepository.getById).toBeCalledWith(downloadTask.identity)
      expect(sfComicDownloadAdapter.asyncDownload).toBeCalledWith(downloadTask)

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
