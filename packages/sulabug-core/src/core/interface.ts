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
  readonly completed: boolean
  readonly progress: IProgress
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