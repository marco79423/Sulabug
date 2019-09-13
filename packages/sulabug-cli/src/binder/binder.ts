import {createComicDatabase} from 'sulabug-core'

import {ISearchCommandHandler, SearchCommandHandler} from '../command/search'
import {GetCommandHandler, IGetCommandHandler} from '../command/get'
import {CoreService, ICoreService} from '../service/core'

// command
let searchCommandHandler: ISearchCommandHandler

export function createSearchCommandHandler(): ISearchCommandHandler {
  if (!searchCommandHandler) {
    searchCommandHandler = new SearchCommandHandler(
      createCoreService()
    )
  }

  return searchCommandHandler
}

let getCommandHandler: IGetCommandHandler

export function createGetCommandHandler(): IGetCommandHandler {
  if (!getCommandHandler) {
    getCommandHandler = new GetCommandHandler(
      createCoreService()
    )
  }

  return getCommandHandler
}

// service
let coreService: ICoreService

export function createCoreService(): ICoreService {
  if(!coreService) {
    coreService = new CoreService(
      createComicDatabase()
    )
  }

  return coreService
}