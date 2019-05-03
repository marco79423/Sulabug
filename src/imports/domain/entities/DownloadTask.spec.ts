import DownloadTask, {DownloadStatus} from './DownloadTask'
import {IDownloadTaskRepository} from '../interfaces'

describe('DownloadTask', () => {
  describe('serialize', () => {
    it('will serialize the DownloadTask instance to json data', () => {
      const jsonData = {
        id: 'id',
        comicId: 'comicId',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
      }

      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        jsonData.id,
        jsonData.comicId,
        jsonData.name,
        jsonData.coverDataUrl,
        downloadTaskRepository,
      )

      expect(downloadTask.serialize()).toEqual({
        ...jsonData,
        status: DownloadStatus.WAITING,
        progress: 0,
      })
    })
  })

  describe('finish', () => {
    it('will change status to FINISH and set progress to 100', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        'id',
        'name',
        'coverDataUrl',
        'sourceUrl',
        downloadTaskRepository,
      )

      expect(downloadTask.status).toBe(DownloadStatus.WAITING)
      expect(downloadTask.progress).toBe(0)
      downloadTask.finish()
      expect(downloadTask.status).toBe(DownloadStatus.FINISHED)
      expect(downloadTask.progress).toBe(100)
      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)
    })
  })

  describe('addProgress', () => {
    it('will add progress', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        'id',
        'name',
        'coverDataUrl',
        'sourceUrl',
        downloadTaskRepository,
      )

      expect(downloadTask.progress).toBe(0)
      downloadTask.addProgress(10)
      expect(downloadTask.progress).toBe(10)
      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)
    })

    it('will change status to DOWNLOADING if the status of download task is not DOWNLOADING', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        'id',
        'name',
        'coverDataUrl',
        'sourceUrl',
        downloadTaskRepository,
      )

      downloadTask.addProgress(10)
      expect(downloadTask.status).toBe(DownloadStatus.DOWNLOADING)
      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)
    })

    it('will change status to FINISH if the progress is 100', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        'id',
        'name',
        'coverDataUrl',
        'sourceUrl',
        downloadTaskRepository,
      )

      downloadTask.addProgress(100)
      expect(downloadTask.status).toBe(DownloadStatus.FINISHED)
      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)
    })

    it('will still 100 if the sum of argument and progress is great than 100', () => {
      const downloadTaskRepository: IDownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        'id',
        'name',
        'coverDataUrl',
        'sourceUrl',
        downloadTaskRepository,
      )

      downloadTask.addProgress(110)
      expect(downloadTask.progress).toBe(100)
      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)
    })
  })
})
