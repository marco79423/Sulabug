import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import coreInjector from '../domain/core/coreInjector'


const domainInjector = coreInjector

if (process.env.NODE_ENV !== 'production') {
  domainInjector.applyMiddleware(makeLoggerMiddleware())
}

export default domainInjector
