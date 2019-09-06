import {getComicDatabase} from 'sulabug-core'

import {ISearchCommandHandler, SearchCommandHandler} from '../command/search'
import {GetCommandHandler, IGetCommandHandler} from '../command/get'
import {CoreService, ICoreService} from '../service/core'

// command
let searchCommandHandler: ISearchCommandHandler

export function getSearchCommandHandler(): ISearchCommandHandler {
  if (!searchCommandHandler) {
    searchCommandHandler = new SearchCommandHandler(
      getCoreService()
    )
  }

  return searchCommandHandler
}

let getCommandHandler: IGetCommandHandler

export function getGetCommandHandler(): IGetCommandHandler {
  if (!getCommandHandler) {
    getCommandHandler = new GetCommandHandler(
      getCoreService()
    )
  }

  return getCommandHandler
}

// service
let coreService: ICoreService

export function getCoreService(): ICoreService {
  if(!coreService) {
    coreService = new CoreService(
      getComicDatabase()
    )
  }

  return coreService
}