import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DeleteDownloadTaskUseCase} from '../interfaces/use-cases'

@injectable()
export default class DeleteDownloadTaskUseCaseImpl implements DeleteDownloadTaskUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  async asyncExecute(request: Request): Promise<Response> {
    const downloadTaskId = request.data
    this._downloadTaskRepository.delete(downloadTaskId)
    return new Response()
  }
}
