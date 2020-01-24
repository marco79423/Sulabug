import {differenceInDays} from 'date-fns'
import {boolean} from 'boolean'
import {IComic, IComicDatabase, IComicFilter, IConfig, IFileAdapter, IPathAdapter} from 'sulabug-core'

export type CreateComicDatabaseFunc = (config: IConfig) => IComicDatabase

export interface ICoreService {
  checkIfComicDatabaseUpdateRequired(): Promise<boolean>

  updateComicDatabase()

  searchComics(filter: IComicFilter): Promise<IComic[]>

  addComicToCollections(comicId: string)

  removeComicFromCollections(comicId: string)

  downloadComic(comicId: string)

  updateConfig(attrName: string, attrValue: string)
}

export class CoreService implements ICoreService {
  private readonly _createComicDatabaseFunc: CreateComicDatabaseFunc
  private readonly _fileAdapter: IFileAdapter
  private readonly _pathAdapter: IPathAdapter
  private _comicDatabase?: IComicDatabase

  constructor(fileAdapter: IFileAdapter, pathAdapter: IPathAdapter, createComicDatabaseFunc: CreateComicDatabaseFunc) {
    this._fileAdapter = fileAdapter
    this._pathAdapter = pathAdapter
    this._createComicDatabaseFunc = createComicDatabaseFunc
  }

  public async checkIfComicDatabaseUpdateRequired(): Promise<boolean> {
    // print(`檢查漫畫資料庫 ...`)

    const UPDATE_FREQUENCY = 7

    const comicDatabase = await this._createComicDatabase()
    const webComicSources = await comicDatabase.fetchAllWebComicSources()

    // 如果來源最後更新時間不存在或過期，便自動更新
    for (const webComicSource of webComicSources) {
      const lastUpdatedTime = await comicDatabase.fetchLastUpdatedTime(webComicSource)
      if (lastUpdatedTime === null || differenceInDays(new Date(), lastUpdatedTime as Date) >= UPDATE_FREQUENCY) {
        return true
      }
    }
    return false
  }

  public async updateComicDatabase() {
    // print(`更新漫畫資料庫 ...`)

    const comicDatabase = await this._createComicDatabase()
    const webComicSources = await comicDatabase.fetchAllWebComicSources()

    for (const webComicSource of webComicSources) {
      // print(`更新漫畫來源： ${webComicSource.name}`)
      await new Promise(resolve => {
        comicDatabase.startUpdateTask(webComicSource)
          .subscribe(taskStatus => {
          if (taskStatus.completed) {
            // print(`${webComicSource.name} 更新完成`)
            resolve()
          }
        })
      })
    }
    // print(`漫畫資料庫更新完成`)
  }

  public async searchComics(filter: IComicFilter): Promise<IComic[]> {
    // print(`搜尋漫畫資料庫 ...`)

    const comicDatabase = await this._createComicDatabase()
    return await new Promise<IComic[]>(resolve => {
      comicDatabase.startQueryComicsTask(filter).subscribe(taskStatus => {
        if (taskStatus.completed) {
          // print(`漫畫資料庫搜尋完成`)
          resolve(taskStatus.result)
        }
      })
    })
  }

  public async addComicToCollections(comicId: string) {
    const comics = await this.searchComics({id: comicId, pattern:''})
    if(comics.length !== 1) {
      throw new Error('unable to get target comic')
    }

    const targetComic = comics[0]
    await targetComic.mark()
    // print(`已收藏 ${targetComic.name}`)
  }

  public async removeComicFromCollections(comicId: string) {
    const comics = await this.searchComics({id: comicId, pattern:''})
    if(comics.length !== 1) {
      throw new Error('unable to get target comic')
    }

    const targetComic = comics[0]
    await targetComic.unmark()
  }

  public async downloadComic(comicId: string) {
    // console.log(`開始下載 ${comic.name} ...`)

    const comics = await this.searchComics({id: comicId, pattern:''})
    if(comics.length !== 1) {
      throw new Error('unable to get target comic')
    }

    const targetComic = comics[0]

    await new Promise(resolve => {
      targetComic.startDownloadTask('.').subscribe(taskStatus => {
        if (taskStatus.completed) {
          // console.log(`${targetComic.name} 下載完成`)
          resolve()
        }
      })
    })

    console.log('漫畫下載完畢')
  }

  public async updateConfig(attrName: string, attrValue: string) {
    const originProfileJson = await this._fetchConfig()
    let profileJson: {databaseDirPath: string, useFakeWebSource: boolean} = {...originProfileJson}

    switch (attrName) {
      case 'database-dir-path':
        profileJson.databaseDirPath = this._pathAdapter.convertToAbsolutePath(attrValue)
        break
      case 'fake-mode':
        profileJson.useFakeWebSource = boolean(attrValue)
        break
      default:
        // print(`抱歉！ ${attrName} 不是合法的設定欄位`)
    }

    const profilePath = this._pathAdapter.joinPaths(this._pathAdapter.getHomeDir(), '.sulabug', 'profile.json')
    await this._fileAdapter.writeJson(profilePath, profileJson)
  }

  private async _createComicDatabase(): Promise<IComicDatabase> {
    if (!this._comicDatabase) {
      const profileJson = await this._fetchConfig()
      this._comicDatabase = this._createComicDatabaseFunc(profileJson)
    }

    return this._comicDatabase
  }

  private async _fetchConfig(): Promise<IConfig> {
    const profilePath = this._pathAdapter.joinPaths(this._pathAdapter.getHomeDir(), '.sulabug', 'profile.json')
    if (!await this._fileAdapter.pathExists(profilePath)) {
      await this._fileAdapter.writeJson(profilePath, this._getDefaultProfile())
    }
    return await this._fileAdapter.readJson(profilePath)
  }

  private _getDefaultProfile(): IConfig {
    return {
      databaseDirPath: this._pathAdapter.joinPaths(this._pathAdapter.getHomeDir(), '.sulabug'),
      useFakeWebSource: false,
    }
  }
}
