import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import {
  ICollectionService,
  IComicDatabaseService,
  IComicFactory,
  IComicRepository,
  IComicSourceFactory,
  IComicSourceSiteService,
  IDBAdapter,
  IDBService,
  IDownloadComicService,
  IDownloadTaskFactory,
  IDownloadTaskRepository,
  IFileAdapter,
  IFileService,
  INetAdapter,
  ITimeAdapter,
  IUserProfileFactory,
  IUserProfileRepository
} from '../domain/interfaces'
import UserProfileRepository from '../infrastructure/domain/repositories/UserProfileRepository'
import types from '../domain/types'
import DBAdapter from '../infrastructure/domain/adapters/DBAdapter'
import Database from '../infrastructure/shared/database/Database'
import ComicRepository from '../infrastructure/domain/repositories/ComicRepository'
import NetAdapter from '../infrastructure/domain/adapters/NetAdapter'
import IDatabase from '../infrastructure/shared/interfaces'
import EventPublisher from '../domain/event/EventPublisher'
import DownloadTaskRepository from '../infrastructure/domain/repositories/DownloadTaskRepository'
import infraTypes from '../infrastructure/infraTypes'
import UserProfileFactory from '../domain/factories/UserProfileFactory'
import FileAdapter from '../infrastructure/domain/adapters/FileAdapter'
import DownloadTaskFactory from '../domain/factories/DownloadTaskFactory'
import DownloadComicService from '../domain/services/DownloadComicService'
import ComicFactory from '../domain/factories/ComicFactory'
import ComicDatabaseService from '../domain/services/ComicDatabaseService'
import FileService from '../domain/services/FileService'
import DBService from '../domain/services/DBService'
import TimeAdapter from '../infrastructure/domain/adapters/TimeAdapter'
import SFComicSourceSiteService from '../domain/services/SFComicSourceSiteService'
import ComicSourceFactory from '../domain/factories/ComicSourceFactory'
import CollectionService from '../domain/services/CollectionService'


// domain
const injector = new Container()

// domain - general
injector.bind<IUserProfileFactory>(types.UserProfileFactory).to(UserProfileFactory).inSingletonScope()
injector.bind<IDBService>(types.DBService).to(DBService).inSingletonScope()
injector.bind<IFileService>(types.FileService).to(FileService).inSingletonScope()
injector.bind<IUserProfileRepository>(types.UserProfileRepository).to(UserProfileRepository).inSingletonScope()
injector.bind<IDBAdapter>(types.DBAdapter).to(DBAdapter).inSingletonScope()
injector.bind<IFileAdapter>(types.FileAdapter).to(FileAdapter).inSingletonScope()
injector.bind<INetAdapter>(types.NetAdapter).to(NetAdapter).inSingletonScope()
injector.bind<ITimeAdapter>(types.TimeAdapter).to(TimeAdapter).inSingletonScope()

// domain - library
injector.bind<IComicFactory>(types.ComicFactory).to(ComicFactory).inSingletonScope()
injector.bind<IComicSourceFactory>(types.ComicSourceFactory).to(ComicSourceFactory).inSingletonScope()
injector.bind<IComicRepository>(types.ComicRepository).to(ComicRepository).inSingletonScope()
injector.bind<IComicDatabaseService>(types.ComicDatabaseService).to(ComicDatabaseService).inSingletonScope()

// domain - collection
injector.bind<ICollectionService>(types.CollectionService).to(CollectionService).inSingletonScope()

// domain - downloader
injector.bind<EventPublisher>(types.EventPublisher).to(EventPublisher).inSingletonScope()
injector.bind<IDownloadTaskFactory>(types.DownloadTaskFactory).to(DownloadTaskFactory).inSingletonScope()
injector.bind<IDownloadTaskRepository>(types.DownloadTaskRepository).to(DownloadTaskRepository).inSingletonScope()
injector.bind<IDownloadComicService>(types.DownloadComicService).to(DownloadComicService).inSingletonScope()

// infrastructure
injector.bind<IDatabase>(infraTypes.Database).to(Database).inSingletonScope()
injector.bind<IComicSourceSiteService>(types.SFComicSourceSiteService).to(SFComicSourceSiteService).inSingletonScope()

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
