import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import DownloadTask from '../entities/DownloadTask'
import {DownloadTaskFactory} from '../interfaces/factories'
import {DownloadTaskRepository} from '../interfaces/repositories'

@injectable()
export default class DownloadTaskFactoryImpl implements DownloadTaskFactory {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  constructor(
    @inject(coreTypes.DownloadTaskRepository) downloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  createFromJson(json: {
    id: string,
    comicInfoId: string,
  }): DownloadTask {
    return new DownloadTask(
      json.id,
      json.comicInfoId,
      this._downloadTaskRepository,
    )
  }
}
