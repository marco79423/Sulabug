import DownloadTask from './entities/DownloadTask'
import ComicInfo from './entities/ComicInfo'
import UserProfile from './entities/UserProfile'
import Comic from './entities/Comic'
import ComicSource from './entities/ComicSource'


export interface IComicInfoFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdatedChapter: string,
    lastUpdatedTime: string,
    summary: string,
    chapters: {
      id: string
      order: number
      name: string
      sourcePageUrl: string
    }[],
  }): ComicInfo
}

export interface IComicSourceFactory {
  createFromJson(json: {
    id: string,
    name: string,
    source: string,
    pageUrl: string,
  }): ComicSource
}

export interface IDownloadTaskFactory {
  createFromJson(json: {
    id: string,
    comicInfoId: string,
    name: string,
    coverDataUrl: string
  }): DownloadTask
}

export interface IDBAdapter {

  asyncCreate(databaseName: string, collections: any[]): Promise<void>

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter): Promise<any[]>

  asyncFindOne(collectionName: string, filter): Promise<any>
}

export interface IFileAdapter {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>

  asyncListFolder(targetPath: string): Promise<string[]>

  asyncRemove(targetPath: string): Promise<void>
}

export interface INetAdapter {

  asyncGetText(targetUrl: string): Promise<string>

  asyncDownload(targetUrl: string, targetPath: string): Promise<void>

  asyncGetBinaryBase64(targetUrl: string): Promise<string>
}

export interface ITimeAdapter {
  getNow(): Date
}

export interface IComicInfoRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}

export interface IComicRepository {
  asyncSaveOrUpdate(comic: Comic): void

  asyncGetById(identity: string): Promise<Comic | null>

  asyncGetAll(): Promise<Comic[]>

  asyncDelete(identity: string): Promise<void>
}

export interface IDownloadTaskRepository {

  saveOrUpdate(downloadTask: DownloadTask): void

  getById(identity: string): DownloadTask

  getAll(): DownloadTask[]

  delete(identity: string): void
}


export interface IUserProfileRepository {

  asyncSaveOrUpdate(userProfile: UserProfile): Promise<void>

  asyncGet(): Promise<UserProfile>
}

export interface IComicFactory {
  createFromJson(json: {
    comicInfoIdentity: string,
  }): Comic
}


export interface IUserProfileFactory {
  createFromJson(json: {
    databaseUpdatedTime: string | null,
    downloadFolderPath: string,
  }): UserProfile
}

export interface IComicInfoDatabaseService {
  asyncUpdateAndReturn(): Promise<ComicInfo[]>
}

export interface IDBService {

  asyncCreate(databaseName: string, collections: any[]): Promise<void>

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter): Promise<any[]>

  asyncFindOne(collectionName: string, filter): Promise<any>
}

export interface IDownloadComicService {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}

export interface IFileService {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>

  asyncListFolder(targetPath: string): Promise<string[]>
}

export interface IComicSourceSiteService {
  asyncGetAllComicSources(): Promise<ComicSource[]>
}
