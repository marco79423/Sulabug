import {inject, injectable} from 'inversify'

import coreTypes from '../downloaderTypes'
import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'

@injectable()
export default class DeleteDownloadTaskUseCase implements AsyncUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(coreTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncExecute = async (request: Request): Promise<Response | ResponseError> => {
    const downloadTaskId = request.data
    this._downloadTaskRepository.delete(downloadTaskId)
    return new Response()
  }
}
