import 'reflect-metadata'

import {IDownloadTaskRepository, ISFComicDownloadAdapter} from '../interfaces'
import DownloadTaskFactory from '../factories/DownloadTaskFactory'
import DownloadComicService from './DownloadComicService'

describe('DownloadComicService', () => {
  it('will handle download task to download comic', async () => {
    const downloadTaskRepository: IDownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)

    const downloadTask = downloadTaskFactory.createFromJson({
      id: 'id',
      comicInfoId: 'comicInfoId',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
    })

    const sfComicDownloadAdapter: ISFComicDownloadAdapter = {
      asyncDownload: jest.fn(),
    }

    const downloadComicService = new DownloadComicService(sfComicDownloadAdapter)

    await downloadComicService.asyncDownload(downloadTask)
    expect(sfComicDownloadAdapter.asyncDownload).toBeCalledWith(downloadTask)
  })
})
