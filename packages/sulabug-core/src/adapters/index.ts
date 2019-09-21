import {DBAdapter} from './db'
import {IConfig, IDBAdapter, IFileAdapter, IHashAdapter, INetAdapter} from '../interface'
import {NetAdapter} from './net'
import FileAdapter from './file'
import {HashAdapter} from './hash'


export function createDBAdapter(config: IConfig): IDBAdapter {
  return new DBAdapter(
    config,
    createFileAdapter(),
  )
}

export function createFileAdapter(): IFileAdapter {
  return new FileAdapter()
}

export function createHashAdapter(): IHashAdapter {
  return new HashAdapter()
}

export function createNetAdapter(): INetAdapter {
  return new NetAdapter()
}
