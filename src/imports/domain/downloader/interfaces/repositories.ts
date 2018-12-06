import Config from '../entities/Config'
import DownloadTask from '../entities/DownloadTask'

export interface ConfigRepository {

  asyncSaveOrUpdate(config: Config): Promise<void>

  asyncGet(): Promise<Config>
}


export interface DownloadTaskRepository {

  saveOrUpdate(downloadTask: DownloadTask): void

  getById(identity: string): DownloadTask

  getAll(): DownloadTask[]

  delete(identity: string): void
}
