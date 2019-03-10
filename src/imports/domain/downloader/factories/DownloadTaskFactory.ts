import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import DownloadTask from '../entities/DownloadTask'
import {IDownloadTaskFactory} from '../interfaces'
import {IDownloadTaskRepository} from '../interfaces'


@injectable()
export default class DownloadTaskFactory implements IDownloadTaskFactory {
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  createFromJson(json: {
    id: string,
    comicInfoId: string,
    name: string,
    coverDataUrl: string,
  }): DownloadTask {
    return new DownloadTask(
      json.id,
      json.comicInfoId,
      json.name,
      json.coverDataUrl,
      this._downloadTaskRepository,
    )
  }
}
