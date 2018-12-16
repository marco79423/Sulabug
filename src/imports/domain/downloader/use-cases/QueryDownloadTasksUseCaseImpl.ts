import {inject, injectable} from 'inversify'
import {Observable, timer} from 'rxjs'
import {map} from 'rxjs/operators'

import downloaderTypes from '../downloaderTypes'
import {Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryDownloadTasksUseCase} from '../interfaces/use-cases'
import DownloadTask from '../entities/DownloadTask'

@injectable()
export default class QueryDownloadTasksUseCaseImpl implements QueryDownloadTasksUseCase {
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository
  ) {
    this._downloadTaskRepository = downloadTaskRepository
  }

  execute = (): Observable<Response> => {
    return this._createStream().pipe(
      this._queryDownloadTasksFromRepositoryOpr(),
      this._returnResponseWithDownloadTasksOpr()
    )
  }

  private _createStream = (): Observable<any> => {
    return timer(0)
  }

  private _queryDownloadTasksFromRepositoryOpr = () => (source: Observable<any>): Observable<DownloadTask[]> => {
    return source.pipe(
      map(() => this._downloadTaskRepository.getAll()),
    )
  }

  private _returnResponseWithDownloadTasksOpr = () => (source: Observable<DownloadTask[]>): Observable<Response> => {
    return source.pipe(
      map((downloadTasks: DownloadTask[]) => new Response(downloadTasks.map(downloadTask => downloadTask.serialize()))),
    )
  }
}
