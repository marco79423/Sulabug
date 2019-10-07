import * as path from 'path'

import {
  ICollectionDAO,
  IComic,
  IComicDAO, IConfig, IFileAdapter,
  IHashAdapter, INetAdapter,
  ITaskStatus,
  IWebComic,
  IWebComicBlueprint,
  IWebComicSourceRepository
} from '../interface'
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

  private readonly _config: IConfig
  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _hashAdapter: IHashAdapter
  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter
  private readonly _comicDAO: IComicDAO
  private readonly _collectionDAO: ICollectionDAO

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

  constructor(config: IConfig, webComicSourceRepository: IWebComicSourceRepository, hashAdapter: IHashAdapter, netAdapter: INetAdapter, fileAdapter: IFileAdapter, comicDAO: IComicDAO, collectionDAO: ICollectionDAO, name: string, source: string, sourcePageUrl: string, coverUrl: string, author: string, summary: string, catalog: string, lastUpdatedChapter: string, lastUpdatedTime: Date, blueprint: IWebComicBlueprint) {
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

    this._config = config
    this._webComicSourceRepository = webComicSourceRepository
    this._hashAdapter = hashAdapter
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
    this._comicDAO = comicDAO
    this._collectionDAO = collectionDAO
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

    this._coverUrl = await this._saveCoverAndReturnFileUrl(coverUrl)
    this._author = author
    this._summary = summary
    this._catalog = catalog
    this._lastUpdatedChapter = lastUpdatedChapter
    this._lastUpdatedTime = lastUpdatedTime

    await this._comicDAO.insertOrUpdate(this)
  }

  public async mark(): Promise<void> {
    await this._collectionDAO.add(this)
  }

  public async unmark(): Promise<void> {
    await this._collectionDAO.remove(this)
  }

  public startDownloadTask(targetDir: string): Observable<ITaskStatus> {
    const webComicSource = this._webComicSourceRepository.get(this.source)
    if (!webComicSource) {
      throw Error('沒抓到對應的 WebComicSource')
    }
    const webComic = webComicSource.createWebComicByBlueprint(this.blueprint)
    return webComic.startDownloadTask(targetDir)
  }

  private async _saveCoverAndReturnFileUrl(coverUrl: string): Promise<string> {
    const data = await this._netAdapter.fetchBinaryData(coverUrl)

    const hash = await this._hashAdapter.encodeWithMD5(data)
    const targetPath = path.join(this._config.databaseDirPath, 'imgs', `${hash}.jpg`)

    await this._fileAdapter.writeData(targetPath, data)

    return require('file-url')(targetPath)
  }
}
