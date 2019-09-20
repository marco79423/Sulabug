import {DatabaseAdapter} from './database'
import {IDatabaseAdapter, INetAdapter} from '../interface'
import {NetAdapter} from './net'


export function createDatabaseAdapter(): IDatabaseAdapter {
  return new DatabaseAdapter()
}

export function createNetAdapter(): INetAdapter {
  return new NetAdapter()
}