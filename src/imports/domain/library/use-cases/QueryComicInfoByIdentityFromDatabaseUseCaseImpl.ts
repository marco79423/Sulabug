import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfoByIdentityFromDatabaseUseCaseImpl implements QueryComicInfoByIdentityFromDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(libraryTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  execute(request: Request): Observable<Response> {
    const identity = request.data
    return Observable.create(async (observer) => {
      const comicInfo = await this._comicInfoStorageRepository.asyncGetById(identity)
      observer.next(new Response((comicInfo as ComicInfo).serialize()))
      observer.complete()
    })
  }
}
