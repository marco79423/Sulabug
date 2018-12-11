import {makeLoggerMiddleware} from 'inversify-logger-middleware'
import domainInjector from '../domain/domainInjector'


const injector = domainInjector

if (process.env.NODE_ENV !== 'production') {
  injector.applyMiddleware(makeLoggerMiddleware())
}

export default injector
