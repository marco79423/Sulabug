import {inject, injectable} from 'inversify'
import {from, Observable, timer} from 'rxjs'
import {mapTo, mergeMap, tap} from 'rxjs/operators'

import {Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {UpdateComicInfoDatabaseUseCase} from '../interfaces/use-cases'
import {SFComicInfoQueryAdapter} from '../interfaces/adapters'
import ComicInfo from '../entities/ComicInfo'

@injectable()
export default class UpdateComicInfoDatabaseUseCaseImpl implements UpdateComicInfoDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository
  private readonly _sfComicInfoQueryAdapter: SFComicInfoQueryAdapter

  public constructor(
    @inject(libraryTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository,
    @inject(libraryTypes.SFComicInfoQueryAdapter) sfComicInfoQueryAdapter: SFComicInfoQueryAdapter,
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
    this._sfComicInfoQueryAdapter = sfComicInfoQueryAdapter
  }

  execute = (): Observable<Response> => {
    return this._createStream().pipe(
      this._queryComicInfosFromSFComicSiteOpr(),
      this._saveComicInfosToDatabaseOpr(),
      this._returnEmptyResponseOpr(),
    )
  }

  private _createStream = (): Observable<any> => {
    return timer(0)
  }

  private _queryComicInfosFromSFComicSiteOpr = () => (source: Observable<any>): Observable<ComicInfo[]> => {
    return source.pipe(
      mergeMap(() => from(this._sfComicInfoQueryAdapter.asyncGetComicInfos()))
    )
  }

  private _saveComicInfosToDatabaseOpr = () => (source: Observable<ComicInfo[]>): Observable<any> => {
    return source.pipe(
      tap(async (comicInfos) => {
        for (let comicInfo of comicInfos) {
          await this._comicInfoStorageRepository.asyncSaveOrUpdate(comicInfo)
        }
      })
    )
  }

  private _returnEmptyResponseOpr = () => (source: Observable<any>): Observable<Response> => {
    return source.pipe(
      mapTo(new Response()),
    )
  }
}
