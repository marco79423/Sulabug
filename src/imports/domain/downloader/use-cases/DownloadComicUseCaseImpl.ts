import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DownloadComicUseCase} from '../interfaces/use-cases'
import {SFComicDownloadAdapter} from '../interfaces/adapters'

@injectable()
export default class DownloadComicUseCaseImpl implements DownloadComicUseCase {
  private readonly _sfComicDownloadAdapter: SFComicDownloadAdapter
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.SFComicDownloadAdapter) sfComicDownloadAdapter: SFComicDownloadAdapter,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._sfComicDownloadAdapter = sfComicDownloadAdapter
    this._downloadTaskRepository = downloadTaskRepository
  }

  async asyncExecute(request: Request): Promise<Response> {
    const downloadTaskId = request.data
    const downloadTask = this._downloadTaskRepository.getById(downloadTaskId)

    await this._sfComicDownloadAdapter.asyncDownload(downloadTask)
    return new Response()
  }
}
