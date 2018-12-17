import {Observable, of} from 'rxjs'
import {inject, injectable} from 'inversify'
import {mapTo, tap} from 'rxjs/operators'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DeleteDownloadTaskUseCase} from '../interfaces/use-cases'

@injectable()
export default class DeleteDownloadTaskUseCaseImpl implements DeleteDownloadTaskUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  execute = (request: Request): Observable<Response> => {
    return this._createDownloadTaskIdStream(request).pipe(
      this._deleteDownloadTaskFromRepositoryOpr(),
      this._returnEmptyResponseOpr(),
    )
  }

  private _createDownloadTaskIdStream = (request: Request): Observable<string> => {
    const downloadTaskId = request.data
    return of(downloadTaskId)
  }

  private _deleteDownloadTaskFromRepositoryOpr = () => (source: Observable<string>): Observable<string> => {
    return source.pipe(
      tap(this._downloadTaskRepository.delete),
    )
  }

  private _returnEmptyResponseOpr = () => (source: Observable<any>): Observable<Response> => {
    return source.pipe(
      mapTo(new Response()),
    )
  }
}
