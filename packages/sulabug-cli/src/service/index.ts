import {CoreService, ICoreService} from './core'
import {createComicDatabase, createFileAdapter, createPathAdapter} from 'sulabug-core'

let coreService: ICoreService

export function createCoreService(): ICoreService {
  if (!coreService) {
    coreService = new CoreService(
      createFileAdapter(),
      createPathAdapter(),
      createComicDatabase,
    )
  }

  return coreService
}
