import {IComicDAO, IComicDatabase, IComicDatabaseInfoDAO, IConfig, IWebComicSourceRepository} from '../interface'
import {WebComicSourceRepository} from './repository'
import {ComicDAO, ComicDatabaseInfoDAO} from './dao'
import {ComicDatabase} from './database'
import {createDBAdapter, createFileAdapter, createHashAdapter, createNetAdapter} from '../adapters'
import {createDumpWebComicSource, createSFWebComicSource} from '../sources'

export function createComicDatabase(config: IConfig): IComicDatabase {
  return new ComicDatabase(
    config,
    createWebComicSourceRepository(),
    createHashAdapter(),
    createNetAdapter(),
    createFileAdapter(),
    createComicDAO(config),
    createComicDatabaseInfoDAO(config),
  )
}

export function createComicDAO(config: IConfig): IComicDAO {
  return new ComicDAO(
    config,
    createWebComicSourceRepository(),
    createDBAdapter(config),
    createHashAdapter(),
    createNetAdapter(),
    createFileAdapter(),
  )
}

export function createComicDatabaseInfoDAO(config: IConfig): IComicDatabaseInfoDAO {
  return new ComicDatabaseInfoDAO(
    createDBAdapter(config)
  )
}

export function createWebComicSourceRepository(): IWebComicSourceRepository {
  const webComicSources = [
    createDumpWebComicSource(),
    createSFWebComicSource(),
  ]

  return new WebComicSourceRepository(webComicSources)
}
