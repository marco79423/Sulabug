import DownloadTask, {DownloadStatus} from './DownloadTask'
import {DownloadTaskRepository} from '../interfaces/repositories'

describe('DownloadTask', () => {
  describe('serialize', () => {
    it('will serialize the DownloadTask instance to json data', () => {
      const jsonData = {
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        sourceUrl: 'sourceUrl',
      }

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTask = new DownloadTask(
        jsonData.id,
        jsonData.name,
        jsonData.coverDataUrl,
        jsonData.sourceUrl,
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
      const downloadTaskRepository: DownloadTaskRepository = {
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
      const downloadTaskRepository: DownloadTaskRepository = {
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
      const downloadTaskRepository: DownloadTaskRepository = {
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
      const downloadTaskRepository: DownloadTaskRepository = {
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
      const downloadTaskRepository: DownloadTaskRepository = {
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
