import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {ConfigFactory} from './interfaces/factories'
import {ConfigRepository} from './interfaces/repositories'
import {UpdateConfigUseCase} from './interfaces/use-cases'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/domain/general/repositories/ConfigRepositoryImpl'
import UpdateConfigUseCaseImpl from './use-cases/UpdateConfigUseCaseImpl'

const generalInjector = new Container()

generalInjector.bind<ConfigFactory>(generalTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

generalInjector.bind<ConfigRepository>(generalTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()

generalInjector.bind<UpdateConfigUseCase>(generalTypes.UpdateConfigUseCase).to(UpdateConfigUseCaseImpl).inSingletonScope()

export default generalInjector
