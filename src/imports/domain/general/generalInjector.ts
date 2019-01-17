import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {IConfigFactory} from './interfaces'
import {IConfigRepository} from './interfaces'
import ConfigFactoryImpl from './factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from '../../infrastructure/domain/general/repositories/ConfigRepositoryImpl'


const generalInjector = new Container()

generalInjector.bind<IConfigFactory>(generalTypes.ConfigFactory).to(ConfigFactoryImpl).inSingletonScope()

generalInjector.bind<IConfigRepository>(generalTypes.ConfigRepository).to(ConfigRepositoryImpl).inSingletonScope()

export default generalInjector
