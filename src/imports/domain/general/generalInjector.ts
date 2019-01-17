import {Container} from 'inversify'

import generalTypes from './generalTypes'
import {IConfigFactory} from './interfaces'
import {IConfigRepository} from './interfaces'
import ConfigFactory from './factories/ConfigFactory'
import ConfigRepository from '../../infrastructure/domain/general/repositories/ConfigRepository'


const generalInjector = new Container()

generalInjector.bind<IConfigFactory>(generalTypes.ConfigFactory).to(ConfigFactory).inSingletonScope()

generalInjector.bind<IConfigRepository>(generalTypes.ConfigRepository).to(ConfigRepository).inSingletonScope()

export default generalInjector
