import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {DownloadComicUseCase} from '../interfaces/use-cases'
import {SFComicDownloadAdapter} from '../interfaces/adapters'

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

  execute(request: Request): Observable<Response> {
    const downloadTaskId = request.data

    return Observable.create(async (observer) => {
      const downloadTask = this._downloadTaskRepository.getById(downloadTaskId)

      await this._sfComicDownloadAdapter.asyncDownload(downloadTask)
      observer.next(new Response())
      observer.complete()
    })

  }
}
