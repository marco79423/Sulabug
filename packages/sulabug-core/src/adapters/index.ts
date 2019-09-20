import {DBAdapter} from './db'
import {IDBAdapter, INetAdapter} from '../interface'
import {NetAdapter} from './net'


export function createDBAdapter(): IDBAdapter {
  return new DBAdapter()
}

export function createNetAdapter(): INetAdapter {
  return new NetAdapter()
}