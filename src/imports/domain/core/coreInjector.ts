import {Container} from 'inversify'

import coreTypes from './coreTypes'
import {FileAdapter, NetAdapter} from './interfaces/adapters'
import {ComicInfoFactory, ConfigFactory, CoverImageFactory} from './interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository} from './interfaces/repositories'
import {SFComicSiteService} from './interfaces/services'
import QueryConfigUseCase from './use-cases/QueryConfigUseCase'
import UpdateConfigUseCase from './use-cases/UpdateConfigUseCase'
import UpdateComicInfoDatabaseUseCase from './use-cases/UpdateComicInfoDatabaseUseCase'
import QueryComicInfosFromDatabaseUseCase from './use-cases/QueryComicInfosFromDatabaseUseCase'
import SFComicSiteServiceImpl from './services/SFComicSiteServiceImpl'
import ComicInfoStorageRepositoryImpl from '../../infrastructure/core/repositories/ComicStorageRepositoryImpl'
import FileAdapterImpl from '../../infrastructure/core/adapters/FileAdapterImpl'
import NetAdapterImpl from '../../infrastructure/core/adapters/NetAdapterImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import CoverImageFactoryImpl from './factories/CoverImageFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/core/repositories/ConfigRepositoryImpl'

const coreInjector = new Container()

coreInjector.bind<FileAdapter>(coreTypes.FileAdapter).to(FileAdapterImpl).inSingletonScope()
coreInjector.bind<NetAdapter>(coreTypes.NetAdapter).to(NetAdapterImpl).inSingletonScope()

coreInjector.bind<ComicInfoFactory>(coreTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
coreInjector.bind<ConfigFactory>(coreTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()
coreInjector.bind<CoverImageFactory>(coreTypes.CoverImageFactory).to(CoverImageFactoryImpl).inSingletonScope()

coreInjector.bind<ConfigRepository>(coreTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()
coreInjector.bind<ComicInfoStorageRepository>(coreTypes.ComicInfoStorageRepository).to(ComicInfoStorageRepositoryImpl).inSingletonScope()

coreInjector.bind<SFComicSiteService>(coreTypes.SFComicSiteService).to(SFComicSiteServiceImpl).inSingletonScope()

coreInjector.bind(QueryConfigUseCase).toSelf().inSingletonScope()
coreInjector.bind(UpdateConfigUseCase).toSelf().inSingletonScope()
coreInjector.bind(UpdateComicInfoDatabaseUseCase).toSelf().inSingletonScope()
coreInjector.bind(QueryComicInfosFromDatabaseUseCase).toSelf().inSingletonScope()

export default coreInjector
