import {Container} from 'inversify'

import coreTypes from './coreTypes'
import EventPublisher from './event/EventPublisher'
import {FileAdapter, NetAdapter} from './interfaces/adapters'
import {ComicInfoFactory, ConfigFactory, CoverImageFactory, DownloadTaskFactory} from './interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository, DownloadTaskRepository} from './interfaces/repositories'
import {SFComicInfoQueryService, SFDownloadComicService} from './interfaces/services'
import QueryConfigUseCase from './use-cases/QueryConfigUseCase'
import UpdateConfigUseCase from './use-cases/UpdateConfigUseCase'
import UpdateComicInfoDatabaseUseCase from './use-cases/UpdateComicInfoDatabaseUseCase'
import QueryComicInfosFromDatabaseUseCase from './use-cases/QueryComicInfosFromDatabaseUseCase'
import CreateDownloadTaskUseCase from './use-cases/CreateDownloadTaskUseCase'
import DeleteDownloadTaskUseCase from './use-cases/DeleteDownloadTaskUseCase'
import QueryDownloadTasksUseCase from './use-cases/QueryDownloadTasksUseCase'
import DownloadComicUseCase from './use-cases/DownloadComicUseCase'
import SFDownloadComicServiceImpl from './services/SFDownloadComicServiceImpl'
import SFComicInfoQueryServiceImpl from './services/SFComicInfoQueryServiceImpl'
import DownloadTaskRepositoryImpl from '../../infrastructure/core/repositories/DownloadTaskRepositoryImpl'
import ComicInfoStorageRepositoryImpl from '../../infrastructure/core/repositories/ComicStorageRepositoryImpl'
import FileAdapterImpl from '../../infrastructure/core/adapters/FileAdapterImpl'
import NetAdapterImpl from '../../infrastructure/core/adapters/NetAdapterImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import CoverImageFactoryImpl from './factories/CoverImageFactoryImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/core/repositories/ConfigRepositoryImpl'

const coreInjector = new Container()

coreInjector.bind(EventPublisher).toSelf().inSingletonScope()

coreInjector.bind<FileAdapter>(coreTypes.FileAdapter).to(FileAdapterImpl).inSingletonScope()
coreInjector.bind<NetAdapter>(coreTypes.NetAdapter).to(NetAdapterImpl).inSingletonScope()

coreInjector.bind<ComicInfoFactory>(coreTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
coreInjector.bind<ConfigFactory>(coreTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()
coreInjector.bind<CoverImageFactory>(coreTypes.CoverImageFactory).to(CoverImageFactoryImpl).inSingletonScope()
coreInjector.bind<DownloadTaskFactory>(coreTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

coreInjector.bind<ConfigRepository>(coreTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()
coreInjector.bind<ComicInfoStorageRepository>(coreTypes.ComicInfoStorageRepository).to(ComicInfoStorageRepositoryImpl).inSingletonScope()
coreInjector.bind<DownloadTaskRepository>(coreTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

coreInjector.bind<SFComicInfoQueryService>(coreTypes.SFComicInfoQueryService).to(SFComicInfoQueryServiceImpl).inSingletonScope()
coreInjector.bind<SFDownloadComicService>(coreTypes.SFDownloadComicService).to(SFDownloadComicServiceImpl).inSingletonScope()

coreInjector.bind(QueryConfigUseCase).toSelf().inSingletonScope()
coreInjector.bind(UpdateConfigUseCase).toSelf().inSingletonScope()
coreInjector.bind(UpdateComicInfoDatabaseUseCase).toSelf().inSingletonScope()
coreInjector.bind(QueryComicInfosFromDatabaseUseCase).toSelf().inSingletonScope()
coreInjector.bind(CreateDownloadTaskUseCase).toSelf().inSingletonScope()
coreInjector.bind(DeleteDownloadTaskUseCase).toSelf().inSingletonScope()
coreInjector.bind(QueryDownloadTasksUseCase).toSelf().inSingletonScope()
coreInjector.bind(DownloadComicUseCase).toSelf().inSingletonScope()

export default coreInjector
