import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {ConfigFactory} from './interfaces/factories'
import {ConfigRepository} from './interfaces/repositories'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/domain/general/repositories/ConfigRepositoryImpl'


const generalInjector = new Container()

generalInjector.bind<ConfigFactory>(generalTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

generalInjector.bind<ConfigRepository>(generalTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()

export default generalInjector
