import {Observable} from 'rxjs'
import {share} from 'rxjs/operators'

import {ITaskStatus, IWebComic, IWebComicSourceRepository} from '../core/interface'
import {IComic, IComicDAO, IComicDatabase, IComicDatabaseInfoDAO} from './interface'
import {Comic} from './comic'

export class ComicDatabase implements IComicDatabase {

  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _comicDAO: IComicDAO
  private readonly _comicDatabaseInfoDAO: IComicDatabaseInfoDAO

  constructor(webComicSourceRepository: IWebComicSourceRepository, comicDAO: IComicDAO, comicDatabaseInfoDAO: IComicDatabaseInfoDAO) {
    this._webComicSourceRepository = webComicSourceRepository
    this._comicDAO = comicDAO
    this._comicDatabaseInfoDAO = comicDatabaseInfoDAO
  }

  /**
   * 抓取漫畫資料庫最後更新的時間
   */
  public async fetchLastUpdatedTime(sourceCode: string): Promise<Date | null> {
    return await this._comicDatabaseInfoDAO.queryLastUpdatedTime(sourceCode)
  }

  public async fetchAllComicSourceCodes(): Promise<string[]> {
    return this._webComicSourceRepository.getAll().map(webComicSource => webComicSource.code)
  }

  /**
   *  更新資料庫
   */
  public startUpdateTask(sourceCode: string): Observable<ITaskStatus> {
    return new Observable<ITaskStatus>(subscriber => {
      const webComicSource = this._webComicSourceRepository.get(sourceCode)
      if (!webComicSource) {
        throw new Error(`target webComicSource with code "${sourceCode}" not found`)
      }

      webComicSource.collectAllWebComics().subscribe(async (taskStatus) => {
        try {
          if (taskStatus.completed) {
            const webComics = taskStatus.result as IWebComic[]
            for (const webComic of webComics) {
              await this._insertOrUpdateToDatabase(webComic)
            }

            await this._comicDatabaseInfoDAO.updateLastUpdatedTime(sourceCode, new Date())
            subscriber.next(taskStatus)
            subscriber.complete()
          } else {
            subscriber.next(taskStatus)
          }
        } catch (e) {
          subscriber.error(e)
        }
      })
    }).pipe(share())
  }

  /**
   *  搜尋資料庫
   */
  public startQueryComicsTask(name: string): Observable<ITaskStatus<IComic[]>> {
    return new Observable<ITaskStatus<IComic[]>>(subscriber => {
      subscriber.next({
        completed: false,
        progress: {
          current: 0,
          total: 1,
          status: '開始搜尋漫畫',
        }
      })

      this._comicDAO.queryAll(name)
        .then(comics => {
          subscriber.next({
            result: comics,
            completed: true,
            progress: {
              current: 1,
              total: 1,
              status: `找到 ${comics.length} 本漫畫`,
            }
          })
        })
        .catch(err => subscriber.error(err))
    })
  }


  private async _insertOrUpdateToDatabase(webComic: IWebComic) {
    const comic = await this._comicDAO.queryOne(webComic.name)
    if (comic != null) {
      await comic.updateInfoByWebComic(webComic)
    } else {
      const [coverUrl, author, summary, catalog, lastUpdatedChapter, lastUpdatedTime] = await Promise.all(
        [
          webComic.fetchCoverUrl(),
          webComic.fetchAuthor(),
          webComic.fetchSummary(),
          webComic.fetchCatalog(),
          webComic.fetchLastUpdatedChapter(),
          webComic.fetchLastUpdatedTime(),
        ]
      )

      await this._comicDAO.insertOrUpdate(new Comic(
        this._webComicSourceRepository,
        this._comicDAO,
        webComic.name,
        webComic.source,
        webComic.sourcePageUrl,
        coverUrl,
        author,
        summary,
        catalog,
        lastUpdatedChapter,
        lastUpdatedTime,
        webComic.blueprint
      ))
    }
  }
}


