import {inject, injectable} from 'inversify'

import types from '../types'
import DownloadTask from '../entities/DownloadTask'
import {IDownloadTaskFactory, IDownloadTaskRepository} from '../interfaces'


@injectable()
export default class DownloadTaskFactory implements IDownloadTaskFactory {
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(types.DownloadTaskRepository) downloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  createFromJson(json: {
    id: string,
    comicId: string,
    name: string,
    coverDataUrl: string,
  }): DownloadTask {
    return new DownloadTask(
      json.id,
      json.comicId,
      json.name,
      json.coverDataUrl,
      this._downloadTaskRepository,
    )
  }
}
