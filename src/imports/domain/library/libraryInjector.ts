import {Container} from 'inversify'

import libraryTypes from './libraryTypes'
import {ISFComicInfoQueryAdapter} from './interfaces'
import {IComicInfoFactory} from './interfaces'
import {IComicInfoRepository} from './interfaces'
import ComicInfoRepositoryImpl from '../../infrastructure/domain/library/repositories/ComicInfoRepositoryImpl'
import ComicInfoFactoryImpl from './factories/ComicInfoFactoryImpl'

import SFComicInfoQueryAdapterImpl from '../../infrastructure/domain/library/adapters/SFComicInfoQueryAdapterImpl'

const libraryInjector = new Container()

libraryInjector.bind<ISFComicInfoQueryAdapter>(libraryTypes.SFComicInfoQueryAdapter).to(SFComicInfoQueryAdapterImpl).inSingletonScope()

libraryInjector.bind<IComicInfoFactory>(libraryTypes.ComicInfoFactory).to(ComicInfoFactoryImpl).inSingletonScope()
libraryInjector.bind<IComicInfoRepository>(libraryTypes.ComicInfoInfoRepository).to(ComicInfoRepositoryImpl).inSingletonScope()

export default libraryInjector
