import {inject, injectable} from 'inversify'
import {from, Observable, of} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'

import {Request, Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfoByIdentityFromDatabaseUseCaseImpl implements QueryComicInfoByIdentityFromDatabaseUseCase {
  private readonly _comicInfoInfoRepository: ComicInfoRepository

  public constructor(
    @inject(libraryTypes.ComicInfoInfoRepository) comicInfoInfoRepository: ComicInfoRepository
  ) {
    this._comicInfoInfoRepository = comicInfoInfoRepository
  }

  execute = (request: Request): Observable<Response> => {
    return this._createComicInfoIdStream(request).pipe(
      this._queryComicInfoByIdOpr(),
      this._returnResponseWithComicInfoOpr(),
    )
  }

  private _createComicInfoIdStream = (request: Request) => {
    const comicInfoId = request.data
    return of(comicInfoId)
  }

  private _queryComicInfoByIdOpr = () => (source: Observable<string>): Observable<ComicInfo> => {
    return source.pipe(
      mergeMap(comicInfoId => from(this._comicInfoInfoRepository.asyncGetById(comicInfoId))),
    )
  }

  private _returnResponseWithComicInfoOpr = () => (source: Observable<ComicInfo>): Observable<Response> => {
    return source.pipe(
      map(comicInfo => new Response(comicInfo.serialize()))
    )
  }
}
