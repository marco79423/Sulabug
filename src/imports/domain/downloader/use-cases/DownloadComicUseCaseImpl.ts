import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {SFDownloadComicService} from '../interfaces/services'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DownloadComicUseCase} from '../interfaces/use-cases'

@injectable()
export default class DownloadComicUseCaseImpl implements DownloadComicUseCase {
  private readonly _sfDownloadComicService: SFDownloadComicService
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.SFDownloadComicService) sfDownloadComicService: SFDownloadComicService,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._sfDownloadComicService = sfDownloadComicService
    this._downloadTaskRepository = downloadTaskRepository
  }

  async asyncExecute(request: Request): Promise<Response> {
    const downloadTaskId = request.data
    const downloadTask = this._downloadTaskRepository.getById(downloadTaskId)

    await this._sfDownloadComicService.asyncDownload(downloadTask)
    return new Response()
  }
}
