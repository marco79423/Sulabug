import {inject, injectable} from 'inversify'
import {from, Observable, of} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'

import {Request, Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoRepository} from '../interfaces/repositories'
import {QueryComicInfosFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfosFromDatabaseUseCaseImpl implements QueryComicInfosFromDatabaseUseCase {
  private readonly _comicInfoInfoRepository: ComicInfoRepository

  public constructor(
    @inject(libraryTypes.ComicInfoInfoRepository) comicInfoInfoRepository: ComicInfoRepository
  ) {
    this._comicInfoInfoRepository = comicInfoInfoRepository
  }

  execute = (request?: Request): Observable<Response> => {
    return this._createSearchTermStream(request).pipe(
      this._queryComicInfosBySearchTermOpr(),
      this._returnResponseWithComicInfosOpr(),
    )
  }

  private _createSearchTermStream = (request?: Request) => {
    let searchTerm = ''
    if (request && request.data) {
      searchTerm = request.data
    }
    return of(searchTerm)
  }

  private _queryComicInfosBySearchTermOpr = () => (source: Observable<string>): Observable<ComicInfo[]> => {
    return source.pipe(
      mergeMap(searchTerm => from(this._comicInfoInfoRepository.asyncGetAllBySearchTerm(searchTerm)))
    )
  }

  private _returnResponseWithComicInfosOpr = () => (source: Observable<ComicInfo[]>): Observable<Response> => {
    return source.pipe(
      map(comicInfos => new Response(comicInfos.map(comicInfo => comicInfo.serialize())))
    )
  }
}

