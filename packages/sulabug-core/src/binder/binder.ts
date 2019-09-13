import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO} from '../domain/interface'
import {ComicDAO, ComicDatabaseInfoDAO, DatabaseAdapter, IDatabaseAdapter} from '../domain/adapters'
import {IWebComicSourceRepository} from '../core/interface'
import {WebComicSourceRepository} from '../core/repository'
import {ComicDatabase} from '../domain/database'


/*
 * Domain
 */
export function createComicDatabase(): IComicDatabase {
  return new ComicDatabase(
    createWebComicSourceRepository(),
    createComicDAO(),
    createComicDatabaseInfoDAO(),
  )
}


export function createComicDAO(): IComicDAO {
  return new ComicDAO(
    createWebComicSourceRepository(),
    createDatabaseAdapter()
  )
}

export function createComicDatabaseInfoDAO(): IComicDatabaseInfoDAO {
  return new ComicDatabaseInfoDAO(
    createDatabaseAdapter()
  )
}

export function createDatabaseAdapter(): IDatabaseAdapter {
  return new DatabaseAdapter()
}

/*
 * Core
 */

export function createWebComicSourceRepository(): IWebComicSourceRepository {
  return new WebComicSourceRepository()
}
