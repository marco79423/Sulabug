import {DBAdapter} from './db'
import {IDBAdapter, IFileAdapter, IHashAdapter, INetAdapter} from '../interface'
import {NetAdapter} from './net'
import FileAdapter from './file'
import {HashAdapter} from './hash'


export function createDBAdapter(): IDBAdapter {
  return new DBAdapter()
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
