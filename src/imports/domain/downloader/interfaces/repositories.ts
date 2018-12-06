import ComicInfo from '../entities/ComicInfo'
import Config from '../entities/Config'
import DownloadTask from '../entities/DownloadTask'

export interface ComicInfoStorageRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo | null>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}


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
