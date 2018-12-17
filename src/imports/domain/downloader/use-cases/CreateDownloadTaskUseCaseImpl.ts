import {inject, injectable} from 'inversify'
import {Observable, of} from 'rxjs'
import {map, mergeMap, tap} from 'rxjs/operators'

import libraryTypes from '../../library/libraryTypes'
import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../library/interfaces/use-cases'
import {CreateDownloadTaskUseCase} from '../interfaces/use-cases'
import DownloadTask from '../entities/DownloadTask'

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

  execute = (request: Request): Observable<Response> => {
    return this._createComicInfoIdStream(request).pipe(
      this._queryComicInfoOpr(),
      this._createAssociatedDownloadTaskByComicInfoOpr(),
      this._saveDownloadTaskToRepositoryOpr(),
      this._returnDownloadTaskOpr(),
    )
  }

  private _createComicInfoIdStream = (request: Request): Observable<string> => {
    const comicInfoId = request.data
    return of(comicInfoId)
  }

  private _queryComicInfoOpr = () => (source: Observable<string>): Observable<{ id: string, name: string, coverDataUrl: string, pageUrl: string }> => {
    return source.pipe(
      mergeMap(comicInfoId => this._queryComicInfoByIdentityFromDatabaseUseCase.execute(new Request(comicInfoId)).pipe(
        map(res => res.data),
      )),
    )
  }

  private _createAssociatedDownloadTaskByComicInfoOpr = () => (source: Observable<{ id: string, name: string, coverDataUrl: string, pageUrl: string }>): Observable<DownloadTask> => {
    return source.pipe(
      map(comicInfo => this._downloadTaskFactory.createFromJson({
        id: comicInfo.id,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      })),
    )
  }

  private _saveDownloadTaskToRepositoryOpr = () => (source: Observable<DownloadTask>): Observable<DownloadTask> => {
    return source.pipe(
      tap(this._downloadTaskRepository.saveOrUpdate)
    )
  }

  private _returnDownloadTaskOpr = () => (source: Observable<DownloadTask>): Observable<Response> => {
    return source.pipe(
      map(downloadTask => new Response(downloadTask.serialize())),
    )
  }
}
