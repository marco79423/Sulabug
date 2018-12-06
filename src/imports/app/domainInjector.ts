import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'

import coreInjector from '../domain/core/coreInjector'
import downloaderInjector from '../domain/downloader/downloaderInjector'


const domainInjector = Container.merge(
  coreInjector,
  downloaderInjector,
)

if (process.env.NODE_ENV !== 'production') {
  domainInjector.applyMiddleware(makeLoggerMiddleware())
}

export default domainInjector
