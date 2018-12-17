import {inject, injectable} from 'inversify'
import {Observable, of} from 'rxjs'
import {map, mapTo, tap} from 'rxjs/operators'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DownloadComicUseCase} from '../interfaces/use-cases'
import {SFComicDownloadAdapter} from '../interfaces/adapters'
import DownloadTask from '../entities/DownloadTask'

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

  execute = (request: Request): Observable<Response> => {
    return this._createDownloadTaskIdStream(request).pipe(
      this._queryDownloadTaskOpr(),
      this._executeDownloadTaskOpr(),
      this._returnEmptyResponseOpr(),
    )
  }

  private _createDownloadTaskIdStream = (request: Request): Observable<string> => {
    const downloadTaskId = request.data
    return of(downloadTaskId)
  }

  private _queryDownloadTaskOpr = () => (source: Observable<string>): Observable<DownloadTask> => {
    return source.pipe(
      map((downloadTaskId) => this._downloadTaskRepository.getById(downloadTaskId)),
    )
  }

  private _executeDownloadTaskOpr = () => (source: Observable<DownloadTask>): Observable<DownloadTask> => {
    return source.pipe(
      tap(async (downloadTask: DownloadTask) => {
        await this._sfComicDownloadAdapter.asyncDownload(downloadTask)
      }),
    )
  }

  private _returnEmptyResponseOpr = () => (source: Observable<any>): Observable<Response> => {
    return source.pipe(
      mapTo(new Response())
    )
  }
}
