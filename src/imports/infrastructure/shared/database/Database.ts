import {inject, injectable} from 'inversify'
import collections from './collections'
import IDatabase from '../interfaces'
import {IDBService} from '../../../domain/interfaces'
import types from '../../../domain/types'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

@injectable()
export default class Database implements IDatabase {

  private readonly _dbService: IDBService
  private _created: boolean

  public constructor(
    @inject(types.DBService) dbService: IDBService,
  ) {
    this._dbService = dbService
    this._created = false

    // noinspection JSIgnoredPromiseFromCall
    this._initialize()
  }

  asyncSaveOrUpdate = async (collectionName: string, item): Promise<void> => {
    await this._waitForInitialized()
    await this._dbService.asyncSaveOrUpdate(collectionName, item)
  }

  asyncFind = async (collectionName: string, filter?): Promise<any> => {
    await this._waitForInitialized()
    return await this._dbService.asyncFind(collectionName, filter)
  }

  asyncFindOne = async (collectionName: string, filter?): Promise<any> => {
    await this._waitForInitialized()
    return await this._dbService.asyncFindOne(collectionName, filter)
  }

  private _waitForInitialized = async () => {
    while (!this._created) {
      await sleep(1000)
    }
  }

  private _initialize = async () => {
    await this._dbService.asyncCreate('sulabug', collections)
    this._created = true
  }
}
