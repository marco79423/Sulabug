import {IComic} from 'sulabug-core'
import {ICoreService} from '../service/core'

const prompts = require('prompts')

const print = console.log


export interface MarkCommandOptions {
  update: boolean
  verbose: boolean
}

export interface IMarkCommandHandler {
  handle(operation: string, pattern: string, {update, verbose}: MarkCommandOptions)
}

export class MarkCommandHandler implements IMarkCommandHandler {

  private readonly _coreService: ICoreService

  constructor(coreService: ICoreService) {
    this._coreService = coreService
  }

  async handle(operation: string, pattern: string, options: MarkCommandOptions) {
    switch (operation) {
      case 'add':
        await this.mark(operation, pattern, options)
        break
      case 'remove':
        await this.unmark(operation, pattern, options)
        break
      case 'sync':
        print('目前尚未支援 sync 喔。')
        break
      default:
        print('目前 mark 只支援 add/remove/sync 喔。')
    }
  }

  async mark(operation: string, pattern: string, options: MarkCommandOptions) {
    /*
    1. 檢查漫畫資料庫
      1. 如果不存在，自動更新
      2. 如果過期，詢問是否更新
    2. 搜尋漫畫資料庫
    3. 搜尋
      1. 如果不存在，跳錯
      2. 如果不只一個結果，詢問是哪一個
    */

    // // 步驟 1: 檢查漫畫資料庫
    const isUpdateRequired = options.update || await this._coreService.checkIfComicDatabaseUpdateRequired()
    if (isUpdateRequired) {
      await this._coreService.updateComicDatabase(options.verbose)
    }

    // 步驟 2: 搜尋漫畫資料庫
    let targetComic: IComic
    const comics = await this._coreService.searchComics({pattern}, options.verbose)

    if (comics.length == 0) {
      // 如果一部都沒有就報錯

      print(`找不到 ${pattern}！`)
      process.exit(1)
    } else if (comics.length > 1) {
      // 如果找到不只一部漫畫就詢問要收藏哪一部

      const {comic} = await prompts({
        type: 'select',
        name: 'comic',
        message: '找到不只一部漫畫，請問是哪一部？',
        choices: comics.map(comic => ({
          title: `${comic.name} [${comic.author}]`,
          value: comic,
        })),
        initial: 0
      })
      targetComic = comic
    } else {
      // 如果只找到一部漫畫就直接選
      targetComic = comics[0]
    }

    await targetComic.mark()
    print(`已收藏 ${targetComic.name}`)
  }

  async unmark(operation: string, pattern: string, options: MarkCommandOptions) {
    /*
    1. 檢查漫畫資料庫
      1. 如果不存在，自動更新
      2. 如果過期，詢問是否更新
    2. 搜尋漫畫資料庫
    3. 搜尋
      1. 如果不存在，跳錯
      2. 如果不只一個結果，詢問是哪一個
    */

    // // 步驟 1: 檢查漫畫資料庫
    const isUpdateRequired = options.update || await this._coreService.checkIfComicDatabaseUpdateRequired()
    if (isUpdateRequired) {
      await this._coreService.updateComicDatabase(options.verbose)
    }

    // 步驟 2: 搜尋漫畫資料庫
    let targetComic: IComic
    const comics = await this._coreService.searchComics({pattern}, options.verbose)

    if (comics.length == 0) {
      // 如果一部都沒有就報錯

      print(`找不到 ${pattern}！`)
      process.exit(1)
    } else if (comics.length > 1) {
      // 如果找到不只一部漫畫就詢問要收藏哪一部

      const {comic} = await prompts({
        type: 'select',
        name: 'comic',
        message: '找到不只一部漫畫，請問是哪一部？',
        choices: comics.map(comic => ({
          title: `${comic.name} [${comic.author}]`,
          value: comic,
        })),
        initial: 0
      })
      targetComic = comic
    } else {
      // 如果只找到一部漫畫就直接選
      targetComic = comics[0]
    }

    await targetComic.unmark()
    print(`已取消收藏 ${targetComic.name}`)
  }
}
