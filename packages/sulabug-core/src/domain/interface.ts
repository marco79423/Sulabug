import {ITaskStatus, IWebComic, IWebComicBlueprint} from '../core/interface'
import {Observable} from 'rxjs'

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

  startDownloadTask(targetDir: string): Observable<ITaskStatus>
}

export interface IComicDatabase {
  /**
   * 抓取漫畫資料庫最後更新的時間
   */
  fetchLastUpdatedTime(sourceCode: string): Promise<Date | null>

  /**
   * 取得所有的漫畫來源的 code
   */
  fetchAllComicSourceCodes(): Promise<string[]>

  /**
   *  更新漫畫資料庫
   */
  startUpdateTask(sourceCode: string): Observable<ITaskStatus>

  /**
   *  搜尋漫畫資料庫
   */
  startQueryComicsTask(name: string): Observable<ITaskStatus<IComic[]>>
}

export interface IComicDAO {
  insertOrUpdate(comic: IComic): Promise<void>

  queryOne(name: string): Promise<IComic>

  queryAll(name: string): Promise<IComic[]>
}

export interface IComicDatabaseInfoDAO {
  updateLastUpdatedTime(sourceCode: string, lastUpdatedTime: Date): Promise<void>

  queryLastUpdatedTime(sourceCode: string): Promise<Date | null>
}