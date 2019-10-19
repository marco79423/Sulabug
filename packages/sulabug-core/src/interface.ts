import {Observable} from 'rxjs'

/**
 * 通用
 */

export interface IProgress {
  readonly current: number
  readonly total: number
  readonly status: string
}

export interface ITaskStatus<T = any> {
  readonly result?: T | undefined
  readonly changed?: T | undefined
  readonly completed: boolean
  readonly progress: IProgress
}

/**
 * 漫畫
 */
export interface IComic {
  readonly name: string
  readonly source: string
  readonly sourcePageUrl: string
  readonly coverUrl: string
  readonly author: string
  readonly summary: string
  readonly catalog: string
  readonly lastUpdatedChapter: string
  readonly lastUpdatedTime: Date
  readonly blueprint: IWebComicBlueprint

  updateInfoByWebComic(webComic: IWebComic): Promise<void>

  mark(): Promise<void>

  unmark(): Promise<void>

  startDownloadTask(targetDir: string): Observable<ITaskStatus>
}

/**
 * 設定
 */
export interface IConfig {
  readonly useFakeWebSource: boolean
  readonly databaseDirPath: string
}

/**
 * 漫畫篩選
 */
export interface IComicFilter {
  readonly marked?: boolean
  readonly pattern: string
}

/**
 * 漫畫資料庫
 */
export interface IComicDatabase {
  /**
   * 抓取漫畫資料庫最後更新的時間
   */
  fetchLastUpdatedTime(webComicSource: IWebComicSource): Promise<Date | null>

  /**
   * 取得所有的漫畫來源
   */
  fetchAllWebComicSources(): Promise<IWebComicSource[]>

  /**
   *  更新漫畫資料庫
   */
  startUpdateTask(webComicSource: IWebComicSource): Observable<ITaskStatus>

  /**
   *  搜尋漫畫資料庫
   */
  startQueryComicsTask(filter: IComicFilter): Observable<ITaskStatus<IComic[]>>
}


/**
 *  網路漫畫來源儲存庫
 */
export interface IWebComicSourceRepository {
  getAll(): IWebComicSource[]

  get(code: string): IWebComicSource | null
}

/**
 *  網路漫畫來源
 */
export interface IWebComicSource {
  readonly code: string
  readonly name: string

  createWebComicByBlueprint(blueprint: IWebComicBlueprint): IWebComic

  collectAllWebComics(): Observable<ITaskStatus>
}

/**
 *  網路漫畫建立資訊
 */
export type IWebComicBlueprint = Record<string, any>

/**
 *  網路漫畫
 */
export interface IWebComic {
  readonly name: string
  readonly source: string
  readonly sourcePageUrl: string
  readonly blueprint: IWebComicBlueprint

  fetchCoverUrl(): Promise<string>

  fetchAuthor(): Promise<string>

  fetchSummary(): Promise<string>

  fetchCatalog(): Promise<string>

  fetchLastUpdatedChapter(): Promise<string>

  fetchLastUpdatedTime(): Promise<Date>

  fetchChapters(): Promise<IWebComicChapter[]>

  startDownloadTask(targetDir: string): Observable<ITaskStatus>
}

export interface IWebComicChapter {
  readonly name: string
  readonly sourcePageUrl: string

  fetchImages(): Promise<IWebComicImage[]>

  startDownloadTask(targetDir: string): Observable<ITaskStatus>
}

export interface IWebComicImage {
  readonly name: string
  readonly imageUrl: string
}


/**
 * 漫畫 DAO
 */
export interface IComicDAO {
  insertOrUpdate(comic: IComic): Promise<void>

  insertOrUpdateMany(comics: IComic[]): Promise<void>

  queryOne(filter: IComicFilter): Promise<IComic | null>

  queryAll(filter: IComicFilter): Promise<IComic[]>
}

/**
 * 收藏 DAO
 */
export interface ICollectionDAO {
  add(comic: IComic): Promise<void>

  remove(comic: IComic): Promise<void>

  has(comic: IComic): Promise<boolean>
}


/**
 * 漫畫資料庫 DAO
 */
export interface IComicDatabaseInfoDAO {
  updateLastUpdatedTime(sourceCode: string, lastUpdatedTime: Date): Promise<void>

  queryLastUpdatedTime(sourceCode: string): Promise<Date | null>
}


/**
 * 資料庫 Adapter
 */
export interface IDBAdapter {
  queryOne(sql: string, params?: any): Promise<any | null>

  queryAll(sql: string, params?: any): Promise<any[]>

  run(sql: string, params?: any): Promise<void>

  runMany(sql: string, paramsArray: any[]): Promise<void>
}

/**
 * 網路 Adapter
 */
export interface INetAdapter {
  fetchText(targetUrl: string): Promise<string>

  fetchBinaryData(targetUrl: string): Promise<Buffer>

  downloadFile(resourceUrl: string, targetPath: string): Promise<void>
}

/**
 * 檔案 Adapter
 */
export interface IFileAdapter {
  ensureDir(targetDirPath: string): Promise<void>

  readJson(targetPath: string, defaultJson?: any): Promise<any>

  writeJson(targetPath: string, json: any): Promise<void>

  writeData(targetPath: string, data: Buffer): Promise<void>

  pathExists(targetPath: string): Promise<boolean>

  listFolder(targetPath: string): Promise<string[]>

  remove(targetPath: string): Promise<void>
}

/**
 * Hash Adapter
 */
export interface IHashAdapter {
  encodeWithMD5(source: string | Buffer): Promise<string>
}

/**
 * 路徑 Adapter
 */
export interface IPathAdapter {
  getHomeDir(): string

  joinPaths(...paths: string[]): string

  convertToAbsolutePath(filepath: string): string

  pathToFileUrl(filePath: string): string
}
