import {CoreService, ICoreService} from './core'
import {createFileAdapter, createPathAdapter, createComicDatabase} from 'sulabug-core'

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
