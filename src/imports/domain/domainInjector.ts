import {Container} from 'inversify'

import coreInjector from '../domain/core/coreInjector'
import libraryInjector from './library/libraryInjector'
import downloaderInjector from '../domain/downloader/downloaderInjector'


const domainInjector = Container.merge(
  coreInjector,
  Container.merge(libraryInjector, downloaderInjector),
)

export default domainInjector
