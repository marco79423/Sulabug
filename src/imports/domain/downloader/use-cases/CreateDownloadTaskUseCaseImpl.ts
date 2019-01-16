import {inject, injectable} from 'inversify'
import {from, Observable, of} from 'rxjs'
import {map, mergeMap, tap} from 'rxjs/operators'

import libraryTypes from '../../library/libraryTypes'
import downloaderTypes from '../downloaderTypes'
import {Request, Response} from '../../base-types'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {CreateDownloadTaskUseCase} from '../interfaces/use-cases'
import DownloadTask from '../entities/DownloadTask'
import {ComicInfoRepository} from '../../library/interfaces/repositories'

@injectable()
export default class CreateDownloadTaskUseCaseImpl implements CreateDownloadTaskUseCase {
  private readonly _comicInfoInfoRepository: ComicInfoRepository
  private readonly _downloadTaskFactory: DownloadTaskFactoryImpl
  private readonly _downloadTaskRepository: DownloadTaskRepository

  public constructor(
    @inject(libraryTypes.ComicInfoInfoRepository) comicInfoInfoRepository: ComicInfoRepository,
    @inject(downloaderTypes.DownloadTaskFactory) downloadTaskFactory: DownloadTaskFactoryImpl,
    @inject(downloaderTypes.DownloadTaskRepository) downloadTaskRepository: DownloadTaskRepository,
  ) {
    this._comicInfoInfoRepository = comicInfoInfoRepository
    this._downloadTaskFactory = downloadTaskFactory
    this._downloadTaskRepository = downloadTaskRepository
  }

  execute = (request: Request): Observable<Response> => {
    return this._createComicInfoIdStream(request).pipe(
      mergeMap(comicInfoId => from(this._comicInfoInfoRepository.asyncGetById(comicInfoId))),
      map(comicInfo => this._downloadTaskFactory.createFromJson({
        id: comicInfo.identity,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      })),
      this._saveDownloadTaskToRepositoryOpr(),
      this._returnDownloadTaskOpr(),
    )
  }

  private _createComicInfoIdStream = (request: Request): Observable<string> => {
    const comicInfoId = request.data
    return of(comicInfoId)
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
