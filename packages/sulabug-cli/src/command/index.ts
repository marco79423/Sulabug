import {ISearchCommandHandler, SearchCommandHandler} from './search'
import {GetCommandHandler, IGetCommandHandler} from './get'
import {createCoreService} from '../service'


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
