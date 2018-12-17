import DownloadTask from '../entities/DownloadTask'

export interface DownloadTaskFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string
  }): DownloadTask
}
