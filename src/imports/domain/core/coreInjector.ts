import {Container} from 'inversify'

import coreTypes from './coreTypes'
import {FileAdapter, NetAdapter} from './interfaces/adapters'
import {ComicInfoFactory, ConfigFactory} from './interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository} from './interfaces/repositories'
import {SFComicSiteService} from './interfaces/services'
import QueryConfigUseCaseImpl from './use-cases/QueryConfigUseCaseImpl'
import UpdateConfigUseCaseImpl from './use-cases/UpdateConfigUseCaseImpl'
import UpdateComicInfoDatabaseUseCaseImpl from './use-cases/UpdateComicInfoDatabaseUseCaseImpl'
import QueryComicInfosFromDatabaseUseCaseImpl from './use-cases/QueryComicInfosFromDatabaseUseCaseImpl'
import SFComicSiteServiceImpl from './services/SFComicSiteServiceImpl'
import ComicInfoStorageRepositoryImpl from '../../infrastructure/core/repositories/ComicStorageRepositoryImpl'
import FileAdapterImpl from '../../infrastructure/core/adapters/FileAdapterImpl'
import NetAdapterImpl from '../../infrastructure/core/adapters/NetAdapterImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/core/repositories/ConfigRepositoryImpl'
import {
  DownloadBinaryUseCase,
  FetchHtmlUseCase,
  QueryComicInfoByIdentityFromDatabaseUseCase,
  QueryComicInfosFromDatabaseUseCase,
  QueryConfigUseCase,
  UpdateComicInfoDatabaseUseCase,
  UpdateConfigUseCase
} from './interfaces/use-cases'
import QueryComicInfoByIdentityFromDatabaseUseCaseImpl
  from './use-cases/QueryComicInfoByIdentityFromDatabaseUseCaseImpl'
import DownloadBinaryUseCaseImpl from './use-cases/DownloadBinaryUseCaseImpl'
import FetchHtmlUseCaseImpl from './use-cases/FetchHtmlUseCaseImpl'

const coreInjector = new Container()

coreInjector.bind<FileAdapter>(coreTypes.FileAdapter).to(FileAdapterImpl).inSingletonScope()
coreInjector.bind<NetAdapter>(coreTypes.NetAdapter).to(NetAdapterImpl).inSingletonScope()

coreInjector.bind<ComicInfoFactory>(coreTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
coreInjector.bind<ConfigFactory>(coreTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

coreInjector.bind<ConfigRepository>(coreTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()
coreInjector.bind<ComicInfoStorageRepository>(coreTypes.ComicInfoStorageRepository).to(ComicInfoStorageRepositoryImpl).inSingletonScope()

coreInjector.bind<SFComicSiteService>(coreTypes.SFComicSiteService).to(SFComicSiteServiceImpl).inSingletonScope()

coreInjector.bind<DownloadBinaryUseCase>(coreTypes.DownloadBinaryUseCase).to(DownloadBinaryUseCaseImpl).inSingletonScope()
coreInjector.bind<FetchHtmlUseCase>(coreTypes.FetchHtmlUseCase).to(FetchHtmlUseCaseImpl).inSingletonScope()
coreInjector.bind<QueryComicInfoByIdentityFromDatabaseUseCase>(coreTypes.QueryComicInfoByIdentityFromDatabaseUseCase).to(QueryComicInfoByIdentityFromDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<QueryComicInfosFromDatabaseUseCase>(coreTypes.QueryComicInfosFromDatabaseUseCase).to(QueryComicInfosFromDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<QueryConfigUseCase>(coreTypes.QueryConfigUseCase).to(QueryConfigUseCaseImpl).inSingletonScope()
coreInjector.bind<UpdateComicInfoDatabaseUseCase>(coreTypes.UpdateComicInfoDatabaseUseCase).to(UpdateComicInfoDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<UpdateConfigUseCase>(coreTypes.UpdateConfigUseCase).to(UpdateConfigUseCaseImpl).inSingletonScope()

export default coreInjector
