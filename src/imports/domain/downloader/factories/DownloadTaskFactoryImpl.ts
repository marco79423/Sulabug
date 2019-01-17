import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import DownloadTask from '../entities/DownloadTask'
import {DownloadTaskFactory} from '../interfaces'
import {DownloadTaskRepository} from '../interfaces'


@injectable()
export default class DownloadTaskFactoryImpl implements DownloadTaskFactory {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string,
    sourceUrl: string,
  }): DownloadTask {
    return new DownloadTask(
      json.id,
      json.name,
      json.coverDataUrl,
      json.sourceUrl,
      this._downloadTaskRepository,
    )
  }
}
