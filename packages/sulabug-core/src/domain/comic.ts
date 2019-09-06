import {IComic, IComicDAO} from './interface'
import {ITaskStatus, IWebComic, IWebComicBlueprint, IWebComicSourceRepository} from '../core/interface'
import {Observable} from 'rxjs'

export class Comic implements IComic {
  public readonly name: string
  public readonly source: string
  public readonly sourcePageUrl: string
  public readonly blueprint: IWebComicBlueprint

  private _coverUrl: string
  private _author: string
  private _summary: string
  private _catalog: string
  private _lastUpdatedChapter: string
  private _lastUpdatedTime: Date

  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _comicDAO: IComicDAO

  get coverUrl(): string {
    return this._coverUrl
  }

  get author(): string {
    return this._author
  }

  get summary(): string {
    return this._summary
  }

  get catalog(): string {
    return this._catalog
  }

  get lastUpdatedChapter(): string {
    return this._lastUpdatedChapter
  }

  get lastUpdatedTime(): Date {
    return this._lastUpdatedTime
  }

  constructor(webComicSourceRepository: IWebComicSourceRepository, comicDAO: IComicDAO, name: string, source: string, sourcePageUrl: string, coverUrl: string, author: string, summary: string, catalog: string, lastUpdatedChapter: string, lastUpdatedTime: Date, blueprint: IWebComicBlueprint) {
    this.name = name
    this.source = source
    this.sourcePageUrl = sourcePageUrl
    this.blueprint = blueprint

    this._coverUrl = coverUrl
    this._author = author
    this._summary = summary
    this._catalog = catalog
    this._lastUpdatedChapter = lastUpdatedChapter
    this._lastUpdatedTime = lastUpdatedTime

    this._webComicSourceRepository = webComicSourceRepository
    this._comicDAO = comicDAO
  }

  public async updateInfoByWebComic(webComic: IWebComic): Promise<void> {
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

    this._coverUrl = coverUrl
    this._author = author
    this._summary = summary
    this._catalog = catalog
    this._lastUpdatedChapter = lastUpdatedChapter
    this._lastUpdatedTime = lastUpdatedTime

    await this._comicDAO.insertOrUpdate(this)
  }

  public startDownloadTask(targetDir: string): Observable<ITaskStatus> {
    const webComicSource = this._webComicSourceRepository.get(this.source)
    if (!webComicSource) {
      throw Error('沒抓到對應的 WebComicSource')
    }
    const webComic = webComicSource.createWebComicByBlueprint(this.blueprint)
    return webComic.startDownloadTask(targetDir)
  }
}