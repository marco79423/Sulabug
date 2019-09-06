import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO} from '../domain/interface'
import {ComicDAO, ComicDatabaseInfoDAO, DatabaseAdapter, IDatabaseAdapter} from '../domain/adapters'
import {IWebComicSourceRepository} from '../core/interface'
import {WebComicSourceRepository} from '../core/repository'
import {ComicDatabase} from '../domain/database'


/*
 * Domain
 */
let comicDatabase: IComicDatabase

export function getComicDatabase(): IComicDatabase {
  if (!comicDatabase) {
    comicDatabase = new ComicDatabase(
      getWebComicSourceRepository(),
      getComicDAO(),
      getComicDatabaseInfoDAO(),
    )
  }

  return comicDatabase
}

let comicDAO: IComicDAO

export function getComicDAO(): IComicDAO {
  if (!comicDAO) {
    comicDAO = new ComicDAO(
      getWebComicSourceRepository(),
      getDatabaseAdapter()
    )
  }

  return comicDAO
}

let comicDatabaseInfoDAO: IComicDatabaseInfoDAO

export function getComicDatabaseInfoDAO(): IComicDatabaseInfoDAO {
  if (!comicDatabaseInfoDAO) {
    comicDatabaseInfoDAO = new ComicDatabaseInfoDAO(
      getDatabaseAdapter()
    )
  }

  return comicDatabaseInfoDAO
}

let databaseAdapter: IDatabaseAdapter

export function getDatabaseAdapter(): IDatabaseAdapter {
  if (!databaseAdapter) {
    databaseAdapter = new DatabaseAdapter()
  }
  return databaseAdapter
}

/*
 * Core
 */
let webComicSourceRepository: IWebComicSourceRepository

export function getWebComicSourceRepository(): IWebComicSourceRepository {
  if (!webComicSourceRepository) {
    webComicSourceRepository = new WebComicSourceRepository()
  }
  return webComicSourceRepository
}
