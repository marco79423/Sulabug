import {injectable} from 'inversify'
import * as RxDB from 'rxdb'

import {DBHandler} from '../interfaces/handlers'

RxDB.plugin(require('pouchdb-adapter-idb'))

@injectable()
export default class DBHandlerImpl implements DBHandler {

  private _database

  asyncCreate = async (databaseName: string, collections: any[]): Promise<void> => {
    this._database = await RxDB.create({
      name: databaseName,
      adapter: 'idb',
    })

    await Promise.all(collections.map(collection => this._database.collection(collection)))
  }

  asyncSaveOrUpdate = async (collectionName: string, item): Promise<void> => {
    if (!this._database) {
      throw new Error('The database wasn\'t created')
    }
    await this._database[collectionName].upsert(item)
  }

  asyncFind = async (collectionName: string, filter): Promise<any[]> => {
    if (!this._database) {
      throw new Error('The database wasn\'t created')
    }
    return await this._database[collectionName].find(filter).exec()
  }

  asyncFindOne = async (collectionName: string, filter): Promise<any> => {
    if (!this._database) {
      throw new Error('The database wasn\'t created')
    }
    return await this._database[collectionName].findOne(filter).exec()
  }
}
