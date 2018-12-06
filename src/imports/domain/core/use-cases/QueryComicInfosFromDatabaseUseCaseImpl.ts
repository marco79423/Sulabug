import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import coreTypes from '../coreTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {QueryComicInfosFromDatabaseUseCase} from '../interfaces/use-cases'


@injectable()
export default class QueryComicInfosFromDatabaseUseCaseImpl implements QueryComicInfosFromDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  async asyncExecute(request?: Request): Promise<Response> {
    let searchTerm = ''
    if (request && request.data) {
      searchTerm = request.data
    }
    const comicInfos: ComicInfo[] = await this._comicInfoStorageRepository.asyncGetAllBySearchTerm(searchTerm)
    return new Response(comicInfos.map(comicInfo => comicInfo.serialize()))
  }
}
