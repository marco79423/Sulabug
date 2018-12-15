import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import {Response} from '../../base-types'
import libraryTypes from '../libraryTypes'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {UpdateComicInfoDatabaseUseCase} from '../interfaces/use-cases'
import {SFComicInfoQueryAdapter} from '../interfaces/adapters'

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

  execute(): Observable<Response> {
    return Observable.create(async (observer) => {
      const comicInfos = await this._sfComicInfoQueryAdapter.asyncGetComicInfos()
      for (let comicInfo of comicInfos) {
        await this._comicInfoStorageRepository.asyncSaveOrUpdate(comicInfo)
      }
      observer.next(new Response())
      observer.complete()
    })
  }
}
