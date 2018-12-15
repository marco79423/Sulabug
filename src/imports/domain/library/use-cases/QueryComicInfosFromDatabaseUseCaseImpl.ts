import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {QueryComicInfosFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfosFromDatabaseUseCaseImpl implements QueryComicInfosFromDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(libraryTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  execute(request?: Request): Observable<Response> {
    let searchTerm = ''
    if (request && request.data) {
      searchTerm = request.data
    }
    return Observable.create(async (observer) => {
      const comicInfos: ComicInfo[] = await this._comicInfoStorageRepository.asyncGetAllBySearchTerm(searchTerm)
      observer.next(new Response(comicInfos.map(comicInfo => comicInfo.serialize())))
      observer.complete()
    })
  }
}
