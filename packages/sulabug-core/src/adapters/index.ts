import {DatabaseAdapter} from './database'
import {IDatabaseAdapter} from '../interface'


export function createDatabaseAdapter(): IDatabaseAdapter {
  return new DatabaseAdapter()
}
