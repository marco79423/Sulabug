import DownloadTask from './entities/DownloadTask'

export interface ISFComicDownloadAdapter {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}

export interface IDownloadTaskFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string
  }): DownloadTask
}

export interface IDownloadTaskRepository {

  saveOrUpdate(downloadTask: DownloadTask): void

  getById(identity: string): DownloadTask

  getAll(): DownloadTask[]

  delete(identity: string): void
}

export interface IDownloadComicService {
   asyncDownload(downloadTask: DownloadTask): Promise<void>
}
