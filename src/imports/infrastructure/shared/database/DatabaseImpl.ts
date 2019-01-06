import {inject, injectable} from 'inversify'

import {DBHandler} from '../../vendor/interfaces/handlers'
import infraTypes from '../../infraTypes'
import collections from './collections'
import Database from '../interfaces/Database'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

@injectable()
export default class DatabaseImpl implements Database {

  private readonly _dbHandler: DBHandler
  private _created: boolean

  public constructor(
    @inject(infraTypes.DBHandler) dbHandler: DBHandler,
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
