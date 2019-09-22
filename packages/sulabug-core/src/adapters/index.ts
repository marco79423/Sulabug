import {DBAdapter} from './db'
import {IConfig, IDBAdapter, IFileAdapter, IHashAdapter, INetAdapter, IPathAdapter} from '../interface'
import {NetAdapter} from './net'
import {FileAdapter} from './file'
import {HashAdapter} from './hash'
import {PathAdapter} from './path'


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


export function createPathAdapter(): IPathAdapter {
  return new PathAdapter()
}
