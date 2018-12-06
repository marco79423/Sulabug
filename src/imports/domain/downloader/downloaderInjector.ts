import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {FileAdapter, NetAdapter} from './interfaces/adapters'
import {ConfigFactory, DownloadTaskFactory} from './interfaces/factories'
import {ConfigRepository, DownloadTaskRepository} from './interfaces/repositories'
import {SFDownloadComicService} from './interfaces/services'
import CreateDownloadTaskUseCase from './use-cases/CreateDownloadTaskUseCase'
import DeleteDownloadTaskUseCase from './use-cases/DeleteDownloadTaskUseCase'
import QueryDownloadTasksUseCase from './use-cases/QueryDownloadTasksUseCase'
import DownloadComicUseCase from './use-cases/DownloadComicUseCase'
import SFDownloadComicServiceImpl from './services/SFDownloadComicServiceImpl'
import DownloadTaskRepositoryImpl from '../../infrastructure/downloader/repositories/DownloadTaskRepositoryImpl'
import FileAdapterImpl from '../../infrastructure/downloader/adapters/FileAdapterImpl'
import NetAdapterImpl from '../../infrastructure/downloader/adapters/NetAdapterImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/downloader/repositories/ConfigRepositoryImpl'

const downloaderInjector = new Container()

downloaderInjector.bind(EventPublisher).toSelf().inSingletonScope()

downloaderInjector.bind<FileAdapter>(downloaderTypes.FileAdapter).to(FileAdapterImpl).inSingletonScope()
downloaderInjector.bind<NetAdapter>(downloaderTypes.NetAdapter).to(NetAdapterImpl).inSingletonScope()

downloaderInjector.bind<ConfigFactory>(downloaderTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()
downloaderInjector.bind<DownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

downloaderInjector.bind<ConfigRepository>(downloaderTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()
downloaderInjector.bind<DownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

downloaderInjector.bind<SFDownloadComicService>(downloaderTypes.SFDownloadComicService).to(SFDownloadComicServiceImpl).inSingletonScope()

downloaderInjector.bind(CreateDownloadTaskUseCase).toSelf().inSingletonScope()
downloaderInjector.bind(DeleteDownloadTaskUseCase).toSelf().inSingletonScope()
downloaderInjector.bind(QueryDownloadTasksUseCase).toSelf().inSingletonScope()
downloaderInjector.bind(DownloadComicUseCase).toSelf().inSingletonScope()

export default downloaderInjector
