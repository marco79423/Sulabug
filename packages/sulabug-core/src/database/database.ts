import {Observable} from 'rxjs'

import {
  IComic,
  IComicDAO,
  IComicDatabase,
  IComicDatabaseInfoDAO,
  IConfig,
  IFileAdapter,
  IHashAdapter,
  INetAdapter,
  ITaskStatus,
  IWebComic,
  IWebComicSource,
  IWebComicSourceRepository
} from '../interface'
import {Comic} from './comic'
import * as path from 'path'

export class ComicDatabase implements IComicDatabase {
  private readonly _config: IConfig
  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _hashAdapter: IHashAdapter
  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter
  private readonly _comicDAO: IComicDAO
  private readonly _comicDatabaseInfoDAO: IComicDatabaseInfoDAO

  constructor(config: IConfig, webComicSourceRepository: IWebComicSourceRepository, hashAdapter: IHashAdapter, netAdapter: INetAdapter, fileAdapter: IFileAdapter, comicDAO: IComicDAO, comicDatabaseInfoDAO: IComicDatabaseInfoDAO) {
    this._config = config
    this._webComicSourceRepository = webComicSourceRepository
    this._hashAdapter = hashAdapter
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
    this._comicDAO = comicDAO
    this._comicDatabaseInfoDAO = comicDatabaseInfoDAO
  }

  /**
   * 抓取漫畫資料庫最後更新的時間
   */
  public async fetchLastUpdatedTime(webComicSource: IWebComicSource): Promise<Date | null> {
    return await this._comicDatabaseInfoDAO.queryLastUpdatedTime(webComicSource.code)
  }

  public async fetchAllWebComicSources(): Promise<IWebComicSource[]> {
    return this._webComicSourceRepository.getAll()
  }

  /**
   *  更新資料庫
   */
  public startUpdateTask(webComicSource: IWebComicSource): Observable<ITaskStatus> {
    return new Observable<ITaskStatus<IComic[]>>(subscriber => {
      webComicSource.collectAllWebComics().subscribe(async (taskStatus) => {
        if (taskStatus.completed) {
          const webComics = taskStatus.result as IWebComic[]
          for (const webComic of webComics) {
            await this._insertOrUpdateToDatabase(webComic)
          }
          await this._comicDatabaseInfoDAO.updateLastUpdatedTime(webComicSource.code, new Date())
          subscriber.next(taskStatus)
          subscriber.complete()
        } else {
          subscriber.next(taskStatus)
        }
      })
    })
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
    if (comic !== null) {
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
        this._config,
        this._webComicSourceRepository,
        this._hashAdapter,
        this._netAdapter,
        this._fileAdapter,
        this._comicDAO,
        webComic.name,
        webComic.source,
        webComic.sourcePageUrl,
        await this._saveCoverAndReturnFileUrl(coverUrl),
        author,
        summary,
        catalog,
        lastUpdatedChapter,
        lastUpdatedTime,
        webComic.blueprint
      ))
    }
  }

  private async _saveCoverAndReturnFileUrl(coverUrl: string): Promise<string> {
    const data = await this._netAdapter.fetchBinaryData(coverUrl)

    const hash = await this._hashAdapter.encodeWithMD5(data)
    const targetPath = path.join(this._config.databaseDirPath, 'imgs', `${hash}.jpg`)

    await this._fileAdapter.writeData(targetPath, data)

    return require('file-url')(targetPath)
  }
}


