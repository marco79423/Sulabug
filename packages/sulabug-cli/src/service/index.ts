import {CoreService, ICoreService} from './core'
import {createComicDatabase} from 'sulabug-core'

let coreService: ICoreService

export function createCoreService(): ICoreService {
  if(!coreService) {
    coreService = new CoreService(
      createComicDatabase({
        databaseDirPath: '.sulabug',
      })
    )
  }

  return coreService
}
