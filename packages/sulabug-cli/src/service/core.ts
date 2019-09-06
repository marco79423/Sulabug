import {IComic, IComicDatabase} from 'sulabug-core/src/domain/interface'
import {differenceInDays} from "date-fns"

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
  private readonly _comicDatabase: IComicDatabase

  constructor(comicDatabase: IComicDatabase) {
    this._comicDatabase = comicDatabase
  }

  public async checkIfComicDatabaseUpdateRequired(): Promise<boolean> {
    print(`檢查漫畫資料庫 ...`)

    const UPDATE_FREQUENCY = 7

    const sourceCodes = await this._comicDatabase.fetchAllComicSourceCodes()

    // 取得漫畫資料庫最後更新時間
    const lastUpdatedTimes = []
    for (const sourceCode of sourceCodes) {
      const lastUpdatedTime = await this._comicDatabase.fetchLastUpdatedTime(sourceCode)
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
    const comicSourceCodes = await this._comicDatabase.fetchAllComicSourceCodes()

    for (const comicSourceCode of comicSourceCodes) {
      print(`更新漫畫來源： ${comicSourceCode}`)

      await new Promise(resolve => {
        let progressBar
        this._comicDatabase.startUpdateTask(comicSourceCode).subscribe(taskStatus => {
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
            print(`${comicSourceCode} 更新完成`)
            resolve()
          }
        })
      })
    }

    print(`漫畫資料庫更新完成`)
  }

  public async searchComics(pattern: string, verbose: boolean): Promise<IComic[]> {
    print(`搜尋漫畫資料庫 ...`)

    return await new Promise<IComic[]>(resolve => {
      let progressBar
      this._comicDatabase.startQueryComicsTask(pattern).subscribe(taskStatus => {
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
}