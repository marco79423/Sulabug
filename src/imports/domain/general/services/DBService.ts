import {inject, injectable} from 'inversify'

import {IDBAdapter, IDBService} from '../interfaces'
import generalTypes from '../generalTypes'

@injectable()
export default class DBService implements IDBService {
  private readonly _dbAdapter: IDBAdapter

  public constructor(
    @inject(generalTypes.DBAdapter) dbAdapter: IDBAdapter,
  ) {
    this._dbAdapter = dbAdapter
  }

  asyncCreate = async (databaseName: string, collections: any[]): Promise<void> => {
    await this._dbAdapter.asyncCreate(databaseName, collections)
  }

  asyncSaveOrUpdate = async (collectionName: string, item): Promise<void> => {
    await this._dbAdapter.asyncSaveOrUpdate(collectionName, item)
  }

  asyncFind = async (collectionName: string, filter): Promise<any[]> => {
    return await this._dbAdapter.asyncFind(collectionName, filter)
  }

  asyncFindOne = async (collectionName: string, filter): Promise<any> => {
    return await this._dbAdapter.asyncFindOne(collectionName, filter)
  }
}
