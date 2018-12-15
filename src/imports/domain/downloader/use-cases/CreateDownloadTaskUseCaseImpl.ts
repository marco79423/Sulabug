import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import libraryTypes from '../../library/libraryTypes'
import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../library/interfaces/use-cases'
import {CreateDownloadTaskUseCase} from '../interfaces/use-cases'

@injectable()
export default class CreateDownloadTaskUseCaseImpl implements CreateDownloadTaskUseCase {
  private readonly _queryComicInfoByIdentityFromDatabaseUseCase: QueryComicInfoByIdentityFromDatabaseUseCase
  private readonly _downloadTaskFactory: DownloadTaskFactoryImpl
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(libraryTypes.QueryComicInfoByIdentityFromDatabaseUseCase) queryComicInfoByIdentityFromDatabaseUseCase: QueryComicInfoByIdentityFromDatabaseUseCase,
    @inject(downloaderTypes.DownloadTaskFactory) downloadTaskFactory: DownloadTaskFactoryImpl,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._queryComicInfoByIdentityFromDatabaseUseCase = queryComicInfoByIdentityFromDatabaseUseCase
    this._downloadTaskFactory = downloadTaskFactory
    this._downloadTaskRepository = downloadTaskRepository
  }

  execute(request: Request): Observable<Response> {
    const comicInfoId = request.data

    return Observable.create(async (observer) => {
      const comicInfo = await this.asyncGetComicInfo(comicInfoId)

      const downloadTask = this._downloadTaskFactory.createFromJson({
        id: comicInfoId,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      })
      this._downloadTaskRepository.saveOrUpdate(downloadTask)
      observer.next(new Response(downloadTask.serialize()))
      observer.complete()
    })
  }

  async asyncGetComicInfo(comicInfoId: string) {
    const res = await this._queryComicInfoByIdentityFromDatabaseUseCase.execute(new Request(comicInfoId)).toPromise()
    return res.data
  }
}
