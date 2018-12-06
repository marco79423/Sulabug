import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryDownloadTasksUseCase} from '../interfaces/use-cases'

@injectable()
export default class QueryDownloadTasksUseCaseImpl implements QueryDownloadTasksUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  async asyncExecute(): Promise<Response> {
    const downloadTasks = this._downloadTaskRepository.getAll()
    return new Response(downloadTasks.map(downloadTask => downloadTask.serialize()))
  }
}
