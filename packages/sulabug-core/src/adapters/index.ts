import {DBAdapter} from './db'
import {IDBAdapter, IFileAdapter, INetAdapter} from '../interface'
import {NetAdapter} from './net'
import FileAdapter from './file'


export function createDBAdapter(): IDBAdapter {
  return new DBAdapter()
}

export function createFileAdapter(): IFileAdapter {
  return new FileAdapter()
}

export function createNetAdapter(): INetAdapter {
  return new NetAdapter()
}
