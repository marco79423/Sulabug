import * as sqlite3 from 'sqlite3'
import {IDBAdapter} from '../interface'

export class DBAdapter implements IDBAdapter {
  private _database: sqlite3.Database

  constructor() {
    this._database = new sqlite3.Database('sulabug.db')
  }

  public async queryOne(sql: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._database.get(sql, params, (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  public async queryAll(sql: string, params?: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._database.all(sql, params, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  public async run(sql: string, params?: any): Promise<void> {
    return new Promise((resolve, reject) => {
      this._database.run(sql, params, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}