import {Container} from 'inversify'

import coreInjector from '../domain/core/coreInjector'
import downloaderInjector from '../domain/downloader/downloaderInjector'


const domainInjector = Container.merge(
  coreInjector,
  downloaderInjector,
)

export default domainInjector
