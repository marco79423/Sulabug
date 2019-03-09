import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import {
  IFileAdapter,
  IFileService,
  INetAdapter,
  INetService,
  IUserProfileFactory,
  IUserProfileRepository
} from '../domain/general/interfaces'
import {
  IDownloadComicService,
  IDownloadTaskFactory,
  IDownloadTaskRepository,
  ISFComicDownloadAdapter
} from '../domain/downloader/interfaces'
import UserProfileRepository from '../infrastructure/domain/general/repositories/UserProfileRepository'
import SFSourceSite from '../infrastructure/shared/source-sites/SFSourceSite'
import downloaderTypes from '../domain/downloader/downloaderTypes'
import DBHandler from '../infrastructure/vendor/handlers/DBHandler'
import SFComicDownloadAdapter from '../infrastructure/domain/downloader/adapters/SFComicDownloadAdapter'
import Database from '../infrastructure/shared/database/Database'
import generalTypes from '../domain/general/generalTypes'
import {
  IComicInfoDatabaseService,
  IComicInfoFactory,
  IComicInfoRepository,
  ISFComicInfoQueryAdapter
} from '../domain/library/interfaces'
import ComicInfoRepository from '../infrastructure/domain/library/repositories/ComicInfoRepository'
import NetAdapter from '../infrastructure/domain/general/adapters/NetAdapter'
import IDatabase, {ISFSourceSite} from '../infrastructure/shared/interfaces'
import EventPublisher from '../domain/downloader/event/EventPublisher'
import SFComicInfoQueryAdapter from '../infrastructure/domain/library/adapters/SFComicInfoQueryAdapter'
import DownloadTaskRepository from '../infrastructure/domain/downloader/repositories/DownloadTaskRepository'
import infraTypes from '../infrastructure/infraTypes'
import {IDBHandler} from '../infrastructure/vendor/interfaces'
import UserProfileFactory from '../domain/general/factories/UserProfileFactory'
import FileAdapter from '../infrastructure/domain/general/adapters/FileAdapter'
import DownloadTaskFactory from '../domain/downloader/factories/DownloadTaskFactory'
import DownloadComicService from '../domain/downloader/services/DownloadComicService'
import ComicInfoFactory from '../domain/library/factories/ComicInfoFactory'
import libraryTypes from '../domain/library/libraryTypes'
import ComicInfoDatabaseService from '../domain/library/services/ComicInfoDatabaseService'
import NetService from '../domain/general/services/NetService'
import FileService from '../domain/general/services/FileService'


// domain
const injector = new Container()

// domain - general
injector.bind<IUserProfileFactory>(generalTypes.UserProfileFactory).to(UserProfileFactory).inSingletonScope()
injector.bind<IFileService>(generalTypes.FileService).to(FileService).inSingletonScope()
injector.bind<INetService>(generalTypes.NetService).to(NetService).inSingletonScope()
injector.bind<IUserProfileRepository>(generalTypes.UserProfileRepository).to(UserProfileRepository).inSingletonScope()
injector.bind<IFileAdapter>(generalTypes.FileAdapter).to(FileAdapter).inSingletonScope()
injector.bind<INetAdapter>(generalTypes.NetAdapter).to(NetAdapter).inSingletonScope()

// domain - library
injector.bind<ISFComicInfoQueryAdapter>(libraryTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapter).inSingletonScope()
injector.bind<IComicInfoFactory>(libraryTypes.ComicInfoFactory).to(ComicInfoFactory).inSingletonScope()
injector.bind<IComicInfoRepository>(libraryTypes.ComicInfoInfoRepository).to(ComicInfoRepository).inSingletonScope()
injector.bind<IComicInfoDatabaseService>(libraryTypes.ComicInfoDatabaseService).to(ComicInfoDatabaseService).inSingletonScope()

// domain - downloader
injector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()
injector.bind<ISFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapter).inSingletonScope()
injector.bind<IDownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactory).inSingletonScope()
injector.bind<IDownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepository).inSingletonScope()
injector.bind<IDownloadComicService>(downloaderTypes.DownloadComicService).to(DownloadComicService).inSingletonScope()

// infrastructure
injector.bind<IDBHandler>(infraTypes.DBHandler).to(DBHandler).inSingletonScope()
injector.bind<IDatabase>(infraTypes.Database).to(Database).inSingletonScope()
injector.bind<ISFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSite).inSingletonScope()

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
