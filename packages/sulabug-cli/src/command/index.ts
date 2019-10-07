import {ISearchCommandHandler, SearchCommandHandler} from './search'
import {GetCommandHandler, IGetCommandHandler} from './get'
import {ConfigCommandHandler, IConfigCommandHandler} from './config'
import {createCoreService} from '../service'
import {IMarkCommandHandler, MarkCommandHandler} from './mark'


export function createSearchCommandHandler(): ISearchCommandHandler {
  return new SearchCommandHandler(
    createCoreService()
  )
}

export function createGetCommandHandler(): IGetCommandHandler {
  return new GetCommandHandler(
    createCoreService()
  )
}

export function createMarkCommandHandler(): IMarkCommandHandler {
  return new MarkCommandHandler(
    createCoreService()
  )
}


export function createConfigCommandHandler(): IConfigCommandHandler {
  return new ConfigCommandHandler(
    createCoreService()
  )
}
