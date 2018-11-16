import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {AsyncUseCase, Response, ResponseError} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'

@injectable()
export default class QueryDownloadTasksUseCase implements AsyncUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(coreTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncExecute = async (): Promise<Response | ResponseError> => {
    const downloadTasks = this._downloadTaskRepository.getAll()
    return new Response(downloadTasks.map(downloadTask => downloadTask.serialize()))
  }
}
