import DownloadTask from './entities/DownloadTask'

export interface SFComicDownloadAdapter {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}

export interface DownloadTaskFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string
  }): DownloadTask
}

export interface DownloadTaskRepository {

  saveOrUpdate(downloadTask: DownloadTask): void

  getById(identity: string): DownloadTask

  getAll(): DownloadTask[]

  delete(identity: string): void
}
