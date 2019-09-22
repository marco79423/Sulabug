import {differenceInDays} from 'date-fns'
import {IComic, IComicDatabase, IFileAdapter, IPathAdapter} from 'sulabug-core'

const ProgressBar = require('progress')
const prompts = require('prompts')

const print = console.log

export interface ICoreService {
  checkIfComicDatabaseUpdateRequired(): Promise<boolean>

  updateComicDatabase(verbose)

  searchComics(pattern: string, verbose: boolean): Promise<IComic[]>

  downloadComic(comic: IComic, verbose: boolean)
}

export class CoreService implements ICoreService {
  private readonly _createComicDatabaseFunc
  private readonly _fileAdapter: IFileAdapter
  private readonly _pathAdapter: IPathAdapter
  private _comicDatabase: IComicDatabase

  constructor(fileAdapter: IFileAdapter, pathAdapter: IPathAdapter, createComicDatabaseFunc) {
    this._fileAdapter = fileAdapter
    this._pathAdapter = pathAdapter
    this._createComicDatabaseFunc = createComicDatabaseFunc
  }

  public async checkIfComicDatabaseUpdateRequired(): Promise<boolean> {
    print(`檢查漫畫資料庫 ...`)

    const UPDATE_FREQUENCY = 7

    const comicDatabase = await this._createComicDatabase()
    const webComicSources = await comicDatabase.fetchAllWebComicSources()

    // 取得漫畫資料庫最後更新時間
    const lastUpdatedTimes = []
    for (const webComicSource of webComicSources) {
      const lastUpdatedTime = await comicDatabase.fetchLastUpdatedTime(webComicSource)
      lastUpdatedTimes.push(lastUpdatedTime)
    }

    // 只要有一個來源最後更新時間不存在，便自動更新
    for (const lastUpdatedTime of lastUpdatedTimes) {
      if (lastUpdatedTime === null) {
        return true
      }
    }

    // 只要有一個漫畫來源過期就詢問是否更新
    for (const lastUpdatedTime of lastUpdatedTimes) {
      if (differenceInDays(new Date(), lastUpdatedTime as Date) >= UPDATE_FREQUENCY) {
        const {shouldUpdate} = await prompts({
          type: 'confirm',
          name: 'shouldUpdate',
          message: '漫畫資料庫過期，請問是否更新？',
          initial: true
        })
        return shouldUpdate
      }
    }

    // 若所有漫畫來源都沒有過期，檢查結束
    return false
  }

  public async updateComicDatabase(verbose) {
    print(`更新漫畫資料庫 ...`)

    const comicDatabase = await this._createComicDatabase()
    const webComicSources = await comicDatabase.fetchAllWebComicSources()

    for (const webComicSource of webComicSources) {
      print(`更新漫畫來源： ${webComicSource.name}`)

      await new Promise(resolve => {
        let progressBar
        comicDatabase.startUpdateTask(webComicSource).subscribe(taskStatus => {
          if (!progressBar) {
            progressBar = new ProgressBar('更新中 [:bar] :current/:total :percent 預估剩餘時間：:eta 秒', {
              width: 30,
              total: taskStatus.progress.total,
            })
          }

          progressBar.tick()

          if (verbose) {
            progressBar.interrupt(taskStatus.progress.status)
          }

          if (taskStatus.completed) {
            print(`${webComicSource.name} 更新完成`)
            resolve()
          }
        })
      })
    }

    print(`漫畫資料庫更新完成`)
  }

  public async searchComics(pattern: string, verbose: boolean): Promise<IComic[]> {
    print(`搜尋漫畫資料庫 ...`)

    const comicDatabase = await this._createComicDatabase()
    return await new Promise<IComic[]>(resolve => {
      let progressBar
      comicDatabase.startQueryComicsTask(pattern).subscribe(taskStatus => {
        if (!progressBar) {
          progressBar = new ProgressBar('搜尋中 [:bar] :current/:total :percent 預估剩餘時間：:eta 秒', {
            width: 30,
            total: taskStatus.progress.total,
          })
        }

        if (verbose) {
          progressBar.interrupt(taskStatus.progress.status)
        }

        if (taskStatus.completed) {
          print(`漫畫資料庫搜尋完成`)
          resolve(taskStatus.result)
        } else {
          progressBar.tick()
        }
      })
    })
  }

  public async downloadComic(comic: IComic, verbose: boolean) {
    console.log(`開始下載 ${comic.name} ...`)

    await new Promise(resolve => {
      let progressBar
      comic.startDownloadTask('.').subscribe(taskStatus => {
        if (!progressBar) {
          progressBar = new ProgressBar('下載中 [:bar] :current/:total :percent 預估剩餘時間：:eta 秒', {
            width: 30,
            total: taskStatus.progress.total,
          })
        }

        progressBar.tick()

        if (verbose) {
          progressBar.interrupt(taskStatus.progress.status)
        }

        if (taskStatus.completed) {
          console.log(`${comic.name} 下載完成`)
          resolve()
        }
      })
    })

    console.log('漫畫下載完畢')
  }

  private async _createComicDatabase(): Promise<IComicDatabase> {
    if (!this._comicDatabase) {
      const profilePath = this._pathAdapter.joinPaths(this._pathAdapter.getHomeDir(), '.sulabug', 'profile.json')
      if (!await this._fileAdapter.pathExists(profilePath)) {
        this._fileAdapter.writeJson(profilePath, {
          databaseDirPath: this._pathAdapter.joinPaths(this._pathAdapter.getHomeDir(), '.sulabug'),
        })
      }

      const profileJson = await this._fileAdapter.readJson(profilePath)
      this._comicDatabase = this._createComicDatabaseFunc(profileJson)
    }

    return this._comicDatabase
  }
}
