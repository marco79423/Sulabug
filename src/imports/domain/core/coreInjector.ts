import {Container} from 'inversify'

import coreTypes from './coreTypes'
import {ConfigFactory} from './interfaces/factories'
import {ConfigRepository} from './interfaces/repositories'
import {QueryConfigUseCase, UpdateConfigUseCase} from './interfaces/use-cases'
import QueryConfigUseCaseImpl from './use-cases/QueryConfigUseCaseImpl'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/domain/core/repositories/ConfigRepositoryImpl'
import UpdateConfigUseCaseImpl from './use-cases/UpdateConfigUseCaseImpl'

const coreInjector = new Container()

coreInjector.bind<ConfigFactory>(coreTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

coreInjector.bind<ConfigRepository>(coreTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()

coreInjector.bind<QueryConfigUseCase>(coreTypes.QueryConfigUseCase).to(QueryConfigUseCaseImpl).inSingletonScope()
coreInjector.bind<UpdateConfigUseCase>(coreTypes.UpdateConfigUseCase).to(UpdateConfigUseCaseImpl).inSingletonScope()

export default coreInjector
