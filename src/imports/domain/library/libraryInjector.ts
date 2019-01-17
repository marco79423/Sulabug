import {Container} from 'inversify'

import libraryTypes from './libraryTypes'
import {ISFComicInfoQueryAdapter} from './interfaces'
import {IComicInfoFactory} from './interfaces'
import {IComicInfoRepository} from './interfaces'
import ComicInfoRepository from '../../infrastructure/domain/library/repositories/ComicInfoRepository'
import ComicInfoFactory from './factories/ComicInfoFactory'

import SFComicInfoQueryAdapter from '../../infrastructure/domain/library/adapters/SFComicInfoQueryAdapter'

const libraryInjector = new Container()

libraryInjector.bind<ISFComicInfoQueryAdapter>(libraryTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapter).inSingletonScope()

libraryInjector.bind<IComicInfoFactory>(libraryTypes.ComicInfoFactory).to(ComicInfoFactory).inSingletonScope()
libraryInjector.bind<IComicInfoRepository>(libraryTypes.ComicInfoInfoRepository).to(ComicInfoRepository).inSingletonScope()

export default libraryInjector
