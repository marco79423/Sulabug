import {Container} from 'inversify'

import coreTypes from './coreTypes'
import { SFComicInfoQueryAdapter} from './interfaces/adapters'
import {ComicInfoFactory, ConfigFactory} from './interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository} from './interfaces/repositories'
import QueryConfigUseCaseImpl from './use-cases/QueryConfigUseCaseImpl'
import UpdateConfigUseCaseImpl from './use-cases/UpdateConfigUseCaseImpl'
import UpdateComicInfoDatabaseUseCaseImpl from './use-cases/UpdateComicInfoDatabaseUseCaseImpl'
import QueryComicInfosFromDatabaseUseCaseImpl from './use-cases/QueryComicInfosFromDatabaseUseCaseImpl'
import ComicInfoStorageRepositoryImpl from '../../infrastructure/domain/core/repositories/ComicStorageRepositoryImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/domain/core/repositories/ConfigRepositoryImpl'
import {
  QueryComicInfoByIdentityFromDatabaseUseCase,
  QueryComicInfosFromDatabaseUseCase,
  QueryConfigUseCase,
  UpdateComicInfoDatabaseUseCase,
  UpdateConfigUseCase
} from './interfaces/use-cases'
import QueryComicInfoByIdentityFromDatabaseUseCaseImpl
  from './use-cases/QueryComicInfoByIdentityFromDatabaseUseCaseImpl'
import SFComicInfoQueryAdapterImpl from '../../infrastructure/domain/core/adapters/SFComicInfoQueryAdapterImpl'

const coreInjector = new Container()

coreInjector.bind<SFComicInfoQueryAdapter>(coreTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapterImpl).inSingletonScope()

coreInjector.bind<ComicInfoFactory>(coreTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
coreInjector.bind<ConfigFactory>(coreTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

coreInjector.bind<ConfigRepository>(coreTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()
coreInjector.bind<ComicInfoStorageRepository>(coreTypes.ComicInfoStorageRepository).to(ComicInfoStorageRepositoryImpl).inSingletonScope()

coreInjector.bind<QueryComicInfoByIdentityFromDatabaseUseCase>(coreTypes.QueryComicInfoByIdentityFromDatabaseUseCase).to(QueryComicInfoByIdentityFromDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<QueryComicInfosFromDatabaseUseCase>(coreTypes.QueryComicInfosFromDatabaseUseCase).to(QueryComicInfosFromDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<QueryConfigUseCase>(coreTypes.QueryConfigUseCase).to(QueryConfigUseCaseImpl).inSingletonScope()
coreInjector.bind<UpdateComicInfoDatabaseUseCase>(coreTypes.UpdateComicInfoDatabaseUseCase).to(UpdateComicInfoDatabaseUseCaseImpl).inSingletonScope()
coreInjector.bind<UpdateConfigUseCase>(coreTypes.UpdateConfigUseCase).to(UpdateConfigUseCaseImpl).inSingletonScope()

export default coreInjector
