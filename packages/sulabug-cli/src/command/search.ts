import {format} from 'date-fns'

import {ICoreService} from '../service/core'

const print = console.log


export interface SearchCommandOptions {
  marked: boolean
  update: boolean
  verbose: boolean
}

export interface ISearchCommandHandler {
  handle(pattern: string, options: SearchCommandOptions)
}

export class SearchCommandHandler implements ISearchCommandHandler {
  private readonly _coreService: ICoreService

  constructor(coreService: ICoreService) {
    this._coreService = coreService
  }

  async handle(pattern: string, options: SearchCommandOptions) {
    /*
    1. 檢查漫畫資料庫
      1. 如果不存在，自動更新
      2. 如果過期，詢問是否更新
    2. 搜尋漫畫資料庫
    3. 顯示漫畫
    */

    // 步驟 1: 檢查漫畫資料庫
    const isUpdateRequired = options.update || await this._coreService.checkIfComicDatabaseUpdateRequired()
    if (isUpdateRequired) {
      await this._coreService.updateComicDatabase(options.verbose)
    }

    // 步驟 2: 搜尋漫畫資料庫
    const comics = await this._coreService.searchComics({pattern, marked: options.marked}, options.verbose)

    // 步驟 3: 顯示漫畫
    if (comics.length > 0) {
      for (const comic of comics) {
        print(`${comic.name} 作者： ${comic.author} 最新章節： ${comic.lastUpdatedChapter} 更新時間： ${format(comic.lastUpdatedTime, 'yyyy/MM/dd')}`)
      }
    } else {
      print('抱歉，沒有搜尋到任何結果')
    }
  }
}
