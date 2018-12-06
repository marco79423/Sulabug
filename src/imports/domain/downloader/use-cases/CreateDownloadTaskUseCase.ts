import {inject, injectable} from 'inversify'

import coreTypes from '../../core/coreTypes'
import downloaderTypes from '../downloaderTypes'
import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'

import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../core/interfaces/use-cases'

@injectable()
export default class CreateDownloadTaskUseCase implements AsyncUseCase {
  private readonly _queryComicInfoByIdentityFromDatabaseUseCase: QueryComicInfoByIdentityFromDatabaseUseCase
  private readonly _downloadTaskFactory: DownloadTaskFactoryImpl
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(coreTypes.QueryComicInfoByIdentityFromDatabaseUseCase) queryComicInfoByIdentityFromDatabaseUseCase: QueryComicInfoByIdentityFromDatabaseUseCase,
    @inject(downloaderTypes.DownloadTaskFactory) downloadTaskFactory: DownloadTaskFactoryImpl,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._queryComicInfoByIdentityFromDatabaseUseCase = queryComicInfoByIdentityFromDatabaseUseCase
    this._downloadTaskFactory = downloadTaskFactory
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncExecute = async (request: Request): Promise<Response | ResponseError> => {
    const comicInfoId = request.data
    const comicInfo = await this.asyncGetComicInfo(comicInfoId)

    const downloadTask = this._downloadTaskFactory.createFromJson({
      id: comicInfoId,
      name: comicInfo.name,
      coverImage: comicInfo.coverImage,
      sourceUrl: comicInfo.pageUrl,
    })
    this._downloadTaskRepository.saveOrUpdate(downloadTask)
    return new Response(downloadTask.serialize())
  }

  async asyncGetComicInfo(comicInfoId: string) {
    const res = await this._queryComicInfoByIdentityFromDatabaseUseCase.asyncExecute(new Request(comicInfoId))
    return res.data
  }
}
