import {Container} from 'inversify'

import libraryTypes from './libraryTypes'
import {SFComicInfoQueryAdapter} from './interfaces/adapters'
import {ComicInfoFactory} from './interfaces/factories'
import {ComicInfoRepository} from './interfaces/repositories'
import UpdateComicInfoDatabaseUseCaseImpl from './use-cases/UpdateComicInfoDatabaseUseCaseImpl'
import QueryComicInfosFromDatabaseUseCaseImpl from './use-cases/QueryComicInfosFromDatabaseUseCaseImpl'
import ComicInfoRepositoryImpl from '../../infrastructure/domain/library/repositories/ComicInfoRepositoryImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'
import {
  QueryComicInfoByIdentityFromDatabaseUseCase,
  QueryComicInfosFromDatabaseUseCase,
  UpdateComicInfoDatabaseUseCase,
} from './interfaces/use-cases'
import QueryComicInfoByIdentityFromDatabaseUseCaseImpl
  from './use-cases/QueryComicInfoByIdentityFromDatabaseUseCaseImpl'
import SFComicInfoQueryAdapterImpl from '../../infrastructure/domain/library/adapters/SFComicInfoQueryAdapterImpl'

const libraryInjector = new Container()

libraryInjector.bind<SFComicInfoQueryAdapter>(libraryTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapterImpl).inSingletonScope()

libraryInjector.bind<ComicInfoFactory>(libraryTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
libraryInjector.bind<ComicInfoRepository>(libraryTypes.ComicInfoInfoRepository).to(ComicInfoRepositoryImpl).inSingletonScope()

libraryInjector.bind<QueryComicInfoByIdentityFromDatabaseUseCase>(libraryTypes.QueryComicInfoByIdentityFromDatabaseUseCase).to(QueryComicInfoByIdentityFromDatabaseUseCaseImpl).inSingletonScope()
libraryInjector.bind<QueryComicInfosFromDatabaseUseCase>(libraryTypes.QueryComicInfosFromDatabaseUseCase).to(QueryComicInfosFromDatabaseUseCaseImpl).inSingletonScope()
libraryInjector.bind<UpdateComicInfoDatabaseUseCase>(libraryTypes.UpdateComicInfoDatabaseUseCase).to(UpdateComicInfoDatabaseUseCaseImpl).inSingletonScope()

export default libraryInjector
