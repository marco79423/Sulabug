import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO} from '../domain/interface'
import {ComicDAO, ComicDatabaseInfoDAO, DatabaseAdapter, IDatabaseAdapter} from '../domain/adapters'
import {IWebComicSourceRepository} from '../core/interface'
import {WebComicSourceRepository} from '../core/repository'
import {ComicDatabase} from '../domain/database'


/*
 * Domain
 */
export function getComicDatabase(): IComicDatabase {
  return new ComicDatabase(
    getWebComicSourceRepository(),
    getComicDAO(),
    getComicDatabaseInfoDAO(),
  )
}


export function getComicDAO(): IComicDAO {
  return new ComicDAO(
    getWebComicSourceRepository(),
    getDatabaseAdapter()
  )
}

export function getComicDatabaseInfoDAO(): IComicDatabaseInfoDAO {
  return new ComicDatabaseInfoDAO(
    getDatabaseAdapter()
  )
}

export function getDatabaseAdapter(): IDatabaseAdapter {
  return new DatabaseAdapter()
}

/*
 * Core
 */

export function getWebComicSourceRepository(): IWebComicSourceRepository {
  return new WebComicSourceRepository()
}
