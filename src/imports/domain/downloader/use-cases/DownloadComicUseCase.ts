import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import {SFDownloadComicService} from '../interfaces/services'
import {DownloadTaskRepository} from '../interfaces/repositories'

@injectable()
export default class DownloadComicUseCase implements AsyncUseCase {
  private readonly _sfDownloadComicService: SFDownloadComicService
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.SFDownloadComicService) sfDownloadComicService: SFDownloadComicService,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._sfDownloadComicService = sfDownloadComicService
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncExecute = async (request: Request): Promise<Response | ResponseError> => {
    const downloadTaskId = request.data
    const downloadTask = this._downloadTaskRepository.getById(downloadTaskId)

    await this._sfDownloadComicService.asyncDownload(downloadTask)
    return new Response()
  }
}
