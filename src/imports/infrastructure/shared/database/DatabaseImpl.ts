import {inject, injectable} from 'inversify'

import {IDBHandler} from '../../vendor/interfaces'
import infraTypes from '../../infraTypes'
import collections from './collections'
import IDatabase from '../interfaces'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

@injectable()
export default class DatabaseImpl implements IDatabase {

  private readonly _dbHandler: IDBHandler
  private _created: boolean

  public constructor(
    @inject(infraTypes.DBHandler) dbHandler: IDBHandler,
  ) {
    this._dbHandler = dbHandler
    this._created = false

    // noinspection JSIgnoredPromiseFromCall
    this._initialize()
  }

  asyncSaveOrUpdate = async (collectionName: string, item): Promise<void> => {
    await this._waitForInitialized()
    await this._dbHandler.asyncSaveOrUpdate(collectionName, item)
  }

  asyncFind = async (collectionName: string, filter?): Promise<any> => {
    await this._waitForInitialized()
    return await this._dbHandler.asyncFind(collectionName, filter)
  }

  asyncFindOne = async (collectionName: string, filter?): Promise<any> => {
    await this._waitForInitialized()
    return await this._dbHandler.asyncFindOne(collectionName, filter)
  }

  private _waitForInitialized = async () => {
    while (!this._created) {
      await sleep(1000)
    }
  }

  private _initialize = async () => {
    await this._dbHandler.asyncCreate('sulabug', collections)
    this._created = true
  }
}
