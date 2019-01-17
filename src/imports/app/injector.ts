import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import {IConfigFactory, IConfigRepository} from '../domain/general/interfaces'
import {
  IDownloadComicService,
  IDownloadTaskFactory,
  IDownloadTaskRepository,
  ISFComicDownloadAdapter
} from '../domain/downloader/interfaces'
import ConfigRepository from '../infrastructure/domain/general/repositories/ConfigRepository'
import SFSourceSite from '../infrastructure/shared/source-sites/SFSourceSite'
import downloaderTypes from '../domain/downloader/downloaderTypes'
import DBHandler from '../infrastructure/vendor/handlers/DBHandler'
import SFComicDownloadAdapter from '../infrastructure/domain/downloader/adapters/SFComicDownloadAdapter'
import Database from '../infrastructure/shared/database/Database'
import generalTypes from '../domain/general/generalTypes'
import {IComicInfoFactory, IComicInfoRepository, ISFComicInfoQueryAdapter} from '../domain/library/interfaces'
import ComicInfoRepository from '../infrastructure/domain/library/repositories/ComicInfoRepository'
import NetHandler from '../infrastructure/vendor/handlers/NetHandler'
import IDatabase, {ISFSourceSite} from '../infrastructure/shared/interfaces'
import EventPublisher from '../domain/downloader/event/EventPublisher'
import SFComicInfoQueryAdapter from '../infrastructure/domain/library/adapters/SFComicInfoQueryAdapter'
import DownloadTaskRepository from '../infrastructure/domain/downloader/repositories/DownloadTaskRepository'
import infraTypes from '../infrastructure/infraTypes'
import {IDBHandler, IFileHandler, INetHandler} from '../infrastructure/vendor/interfaces'
import ConfigFactory from '../domain/general/factories/ConfigFactory'
import FileHandler from '../infrastructure/vendor/handlers/FileHandler'
import DownloadTaskFactory from '../domain/downloader/factories/DownloadTaskFactory'
import DownloadComicService from '../domain/downloader/services/DownloadComicService'
import ComicInfoFactory from '../domain/library/factories/ComicInfoFactory'
import libraryTypes from '../domain/library/libraryTypes'


// domain
const injector = new Container()

// domain - general
injector.bind<IConfigFactory>(generalTypes.ConfigFactory).to(ConfigFactory).inSingletonScope()
injector.bind<IConfigRepository>(generalTypes.ConfigRepository).to(ConfigRepository).inSingletonScope()

// domain - library
injector.bind<ISFComicInfoQueryAdapter>(libraryTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapter).inSingletonScope()
injector.bind<IComicInfoFactory>(libraryTypes.ComicInfoFactory).to(ComicInfoFactory).inSingletonScope()
injector.bind<IComicInfoRepository>(libraryTypes.ComicInfoInfoRepository).to(ComicInfoRepository).inSingletonScope()

// domain - downloader
injector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()
injector.bind<ISFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapter).inSingletonScope()
injector.bind<IDownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactory).inSingletonScope()
injector.bind<IDownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepository).inSingletonScope()
injector.bind<IDownloadComicService>(downloaderTypes.DownloadComicService).to(DownloadComicService).inSingletonScope()

// infrastructure
injector.bind<IDBHandler>(infraTypes.DBHandler).to(DBHandler).inSingletonScope()
injector.bind<IFileHandler>(infraTypes.FileHandler).to(FileHandler).inSingletonScope()
injector.bind<INetHandler>(infraTypes.NetHandler).to(NetHandler).inSingletonScope()
injector.bind<IDatabase>(infraTypes.Database).to(Database).inSingletonScope()
injector.bind<ISFSourceSite>(infraTypes.SFSourceSite).to(SFSourceSite).inSingletonScope()

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
