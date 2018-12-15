import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

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

  execute(request: Request): Observable<Response> {
    const downloadTaskId = request.data
    return Observable.create(async (observer) => {
      this._downloadTaskRepository.delete(downloadTaskId)
      observer.next(new Response())
      observer.complete()
    })
  }
}
