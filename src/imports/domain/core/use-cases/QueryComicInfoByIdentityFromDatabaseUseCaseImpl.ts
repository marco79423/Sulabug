import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import coreTypes from '../coreTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfoByIdentityFromDatabaseUseCaseImpl implements QueryComicInfoByIdentityFromDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  async asyncExecute(request: Request): Promise<Response> {
    const identity = request.data
    const comicInfo = await this._comicInfoStorageRepository.asyncGetById(identity)
    return new Response((comicInfo as ComicInfo).serialize())
  }
}
