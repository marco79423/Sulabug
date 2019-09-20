import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO, IWebComicSourceRepository} from '../interface'
import {WebComicSourceRepository} from './repository'
import {ComicDAO, ComicDatabaseInfoDAO} from './dao'
import {ComicDatabase} from './database'
import {createDBAdapter} from '../adapters'
import {createDumpWebComicSource, createSFWebComicSource} from '../sources'

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
    createDBAdapter()
  )
}

export function createComicDatabaseInfoDAO(): IComicDatabaseInfoDAO {
  return new ComicDatabaseInfoDAO(
    createDBAdapter()
  )
}

export function createWebComicSourceRepository(): IWebComicSourceRepository {
  const webComicSources = [
    createDumpWebComicSource(),
    createSFWebComicSource(),
  ]

  return new WebComicSourceRepository(webComicSources)
}