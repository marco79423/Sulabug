import {CoreService, ICoreService} from './core'
import {createFileAdapter, createComicDatabase} from 'sulabug-core'

let coreService: ICoreService

export function createCoreService(): ICoreService {
  if (!coreService) {
    coreService = new CoreService(
      createFileAdapter(),
      createComicDatabase,
    )
  }

  return coreService
}
