import {inject, injectable} from 'inversify'

import {IDBAdapter, IFileAdapter} from '../../../domain/interfaces'
import types from '../../../domain/types'

@injectable()
export default class DBAdapter implements IDBAdapter {
  private readonly _fileAdapter: IFileAdapter
  private _database

  public constructor(
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
  ) {
    this._fileAdapter = fileAdapter
  }

  asyncCreate = async (databaseName: string, collections: any[]): Promise<void> => {
    this._database = await this._fileAdapter.asyncReadJson('db.json', collections.reduce((database, collection) => ({
      ...database,
      [collection]: {}
    }), {}))
  }

  asyncSaveOrUpdate = async (collectionName: string, item): Promise<void> => {
    if (!this._database) {
      throw new Error('The database wasn\'t created')
    }
    this._database[collectionName] = {
      ...this._database[collectionName],
      [item.id]: item,
    }
    await this._fileAdapter.asyncWriteJson('db.json', this._database)
  }

  asyncFind = async (collectionName: string, filter): Promise<any[]> => {
    if (!this._database) {
      throw new Error('The database wasn\'t created')
    }

    return Object.keys(this._database[collectionName])
      .map(id => this._database[collectionName][id])
      .filter(item => item && this._checkItemByFilter(item, filter))
  }

  asyncFindOne = async (collectionName: string, filter): Promise<any> => {
    const items = await this.asyncFind(collectionName, filter)
    return items[0]
  }

  _checkItemByFilter = (item, filter = {}) => {
    for (const key of Object.keys(filter)) {
      // by key directly
      if (filter[key] === item[key]) {
        continue
      }

      // by regex
      if (filter[key].$regex) {
        const re = new RegExp(filter[key].$regex)
        if (re.test(item[key])) {
          continue
        }
      }

      return false
    }
    return true
  }
}
