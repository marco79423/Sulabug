import {Container} from 'inversify'
import {makeLoggerMiddleware} from 'inversify-logger-middleware'

import domainInjector from '../domain/domainInjector'
import infraInjector from '../infrastructure/infraInjector'

const injector = Container.merge(
  domainInjector,
  infraInjector,
)

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
