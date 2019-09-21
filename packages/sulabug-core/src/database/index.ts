import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO, IWebComicSourceRepository} from '../interface'
import {WebComicSourceRepository} from './repository'
import {ComicDAO, ComicDatabaseInfoDAO} from './dao'
import {ComicDatabase} from './database'
import {createDBAdapter, createFileAdapter, createHashAdapter, createNetAdapter} from '../adapters'
import {createDumpWebComicSource, createSFWebComicSource} from '../sources'

export function createComicDatabase(): IComicDatabase {
  return new ComicDatabase(
    createWebComicSourceRepository(),
    createHashAdapter(),
    createNetAdapter(),
    createFileAdapter(),
    createComicDAO(),
    createComicDatabaseInfoDAO(),
  )
}

export function createComicDAO(): IComicDAO {
  return new ComicDAO(
    createWebComicSourceRepository(),
    createDBAdapter(),
    createHashAdapter(),
    createNetAdapter(),
    createFileAdapter(),
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
