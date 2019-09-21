import * as path from 'path'
import * as sqlite3 from 'sqlite3'
import {IConfig, IDBAdapter, IFileAdapter} from '../interface'

export class DBAdapter implements IDBAdapter {
  private readonly _config: IConfig
  private readonly _fileAdapter: IFileAdapter

  private _database: sqlite3.Database


  constructor(config: IConfig, fileAdapter: IFileAdapter) {
    this._config = config
    this._fileAdapter = fileAdapter
  }

  public async queryOne(sql: string, params?: any): Promise<any> {
    const database = await this._createDatabase()
    return new Promise((resolve, reject) => {
      database.get(sql, params, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  public async queryAll(sql: string, params?: any): Promise<any[]> {
    const database = await this._createDatabase()
    return new Promise((resolve, reject) => {
      database.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  public async run(sql: string, params?: any): Promise<void> {
    const database = await this._createDatabase()
    return new Promise((resolve, reject) => {
      database.run(sql, params, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  private async _createDatabase(): Promise<sqlite3.Database> {
    if (!this._database) {
      await this._fileAdapter.ensureDir(this._config.databaseDirPath)
      this._database = new sqlite3.Database(path.join(this._config.databaseDirPath, 'comic.db'))
    }
    return this._database
  }
}
