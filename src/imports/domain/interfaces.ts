import DownloadTask from './entities/DownloadTask'
import Comic from './entities/Comic'
import UserProfile from './entities/UserProfile'
import ComicSource from './entities/ComicSource'


export interface IComicFactory {
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
  }): Comic
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
    comicId: string,
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

export interface IComicRepository {

  asyncSaveOrUpdate(comic: Comic): Promise<void>

  asyncGetById(id: string): Promise<Comic>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<Comic[]>
}

export interface ICollectionService {
  asyncAddComicToCollection(id: string): Promise<void>

  asyncGetAllComicsFromCollection(): Promise<Comic[]>

  asyncCheckCollection(id: string): Promise<boolean>

  asyncRemoveComicFromCollection(id: string): Promise<void>
}

export interface IDownloadTaskRepository {

  saveOrUpdate(downloadTask: DownloadTask): void

  getById(id: string): DownloadTask

  getAll(): DownloadTask[]

  delete(id: string): void
}


export interface IUserProfileRepository {

  asyncSaveOrUpdate(userProfile: UserProfile): Promise<void>

  asyncGet(): Promise<UserProfile>
}

export interface IUserProfileFactory {
  createFromJson(json: {
    databaseUpdatedTime: string | null,
    downloadFolderPath: string,
  }): UserProfile
}

export interface IComicDatabaseService {
  asyncUpdateAndReturn(): Promise<Comic[]>
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
