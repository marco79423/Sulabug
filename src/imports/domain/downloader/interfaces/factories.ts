import Config from '../entities/Config'
import DownloadTask from '../entities/DownloadTask'

export interface ConfigFactory {
  createFromJson(json: {
    comicsFolder: string,
    comicInfoStorePath: string,
  }): Config
}

export interface DownloadTaskFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string
  }): DownloadTask
}
