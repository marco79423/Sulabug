import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'

@injectable()
export default class CreateDownloadTaskUseCase implements AsyncUseCase {
  private readonly _downloadTaskFactory: DownloadTaskFactoryImpl
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(coreTypes.DownloadTaskFactory) downloadTaskFactory: DownloadTaskFactoryImpl,
    @inject(coreTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._downloadTaskFactory = downloadTaskFactory
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncExecute = async (request: Request): Promise<Response | ResponseError> => {
    const comicInfoId = request.data
    const downloadTask = this._downloadTaskFactory.createFromJson({
      id: comicInfoId,
      comicInfoId: comicInfoId,
    })
    this._downloadTaskRepository.saveOrUpdate(downloadTask)
    return new Response(downloadTask.serialize())
  }
}
