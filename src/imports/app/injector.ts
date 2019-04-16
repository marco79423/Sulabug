import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import {
  IComicFactory, IComicRepository,
  IComicInfoDatabaseService,
  IComicInfoFactory,
  IComicInfoRepository,
  IDBAdapter,
  IDBService,
  IDownloadComicService,
  IDownloadTaskFactory,
  IDownloadTaskRepository,
  IFileAdapter,
  IFileService,
  INetAdapter,
  INetService,
  ISFComicDownloadAdapter,
  ISFComicInfoQueryAdapter,
  IUserProfileFactory,
  IUserProfileRepository, ITimeAdapter
} from '../domain/interfaces'
import UserProfileRepository from '../infrastructure/domain/repositories/UserProfileRepository'
import SFSourceSite from '../infrastructure/shared/source-sites/SFSourceSite'
import types from '../domain/types'
import DBAdapter from '../infrastructure/domain/adapters/DBAdapter'
import SFComicDownloadAdapter from '../infrastructure/domain/adapters/SFComicDownloadAdapter'
import Database from '../infrastructure/shared/database/Database'
import ComicInfoRepository from '../infrastructure/domain/repositories/ComicInfoRepository'
import NetAdapter from '../infrastructure/domain/adapters/NetAdapter'
import IDatabase, {ISFSourceSite} from '../infrastructure/shared/interfaces'
import EventPublisher from '../domain/event/EventPublisher'
import SFComicInfoQueryAdapter from '../infrastructure/domain/adapters/SFComicInfoQueryAdapter'
import DownloadTaskRepository from '../infrastructure/domain/repositories/DownloadTaskRepository'
import infraTypes from '../infrastructure/infraTypes'
import UserProfileFactory from '../domain/factories/UserProfileFactory'
import FileAdapter from '../infrastructure/domain/adapters/FileAdapter'
import DownloadTaskFactory from '../domain/factories/DownloadTaskFactory'
import DownloadComicService from '../domain/services/DownloadComicService'
import ComicInfoFactory from '../domain/factories/ComicInfoFactory'
import ComicInfoDatabaseService from '../domain/services/ComicInfoDatabaseService'
import NetService from '../domain/services/NetService'
import FileService from '../domain/services/FileService'
import DBService from '../domain/services/DBService'
import ComicFactory from '../domain/factories/ComicFactory'
import ComicRepository from '../infrastructure/domain/repositories/ComicRepository'
import TimeAdapter from '../infrastructure/domain/adapters/TimeAdapter'


// domain
const injector = new Container()

// domain - general
injector.bind<IUserProfileFactory>(types.UserProfileFactory).to(UserProfileFactory).inSingletonScope()
injector.bind<IDBService>(types.DBService).to(DBService).inSingletonScope()
injector.bind<IFileService>(types.FileService).to(FileService).inSingletonScope()
injector.bind<INetService>(types.NetService).to(NetService).inSingletonScope()
injector.bind<IUserProfileRepository>(types.UserProfileRepository).to(UserProfileRepository).inSingletonScope()
injector.bind<IDBAdapter>(types.DBAdapter).to(DBAdapter).inSingletonScope()
injector.bind<IFileAdapter>(types.FileAdapter).to(FileAdapter).inSingletonScope()
injector.bind<INetAdapter>(types.NetAdapter).to(NetAdapter).inSingletonScope()
injector.bind<ITimeAdapter>(types.TimeAdapter).to(TimeAdapter).inSingletonScope()

// domain - library
injector.bind<ISFComicInfoQueryAdapter>(types.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapter).inSingletonScope()
injector.bind<IComicInfoFactory>(types.ComicInfoFactory).to(ComicInfoFactory).inSingletonScope()
injector.bind<IComicInfoRepository>(types.ComicInfoRepository).to(ComicInfoRepository).inSingletonScope()
injector.bind<IComicInfoDatabaseService>(types.ComicInfoDatabaseService).to(ComicInfoDatabaseService).inSingletonScope()

// domain - collection
injector.bind<IComicFactory>(types.ComicFactory).to(ComicFactory).inSingletonScope()
injector.bind<IComicRepository>(types.ComicRepository).to(ComicRepository).inSingletonScope()

// domain - downloader
injector.bind<EventPublisher>(types.EventPublisher).to(EventPublisher).inSingletonScope()
injector.bind<ISFComicDownloadAdapter>(types.SFComicDownloadAdapter).to(SFComicDownloadAdapter).inSingletonScope()
injector.bind<IDownloadTaskFactory>(types.DownloadTaskFactory).to(DownloadTaskFactory).inSingletonScope()
injector.bind<IDownloadTaskRepository>(types.DownloadTaskRepository).to(DownloadTaskRepository).inSingletonScope()
injector.bind<IDownloadComicService>(types.DownloadComicService).to(DownloadComicService).inSingletonScope()

// infrastructure
injector.bind<IDatabase>(infraTypes.Database).to(Database).inSingletonScope()
injector.bind<ISFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSite).inSingletonScope()

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
