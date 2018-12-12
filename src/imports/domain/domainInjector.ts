import {Container} from 'inversify'

import generalInjector from './general/generalInjector'
import libraryInjector from './library/libraryInjector'
import downloaderInjector from '../domain/downloader/downloaderInjector'


const domainInjector = Container.merge(
  generalInjector,
  Container.merge(libraryInjector, downloaderInjector),
)

export default domainInjector
