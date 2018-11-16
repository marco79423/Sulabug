import {inject, injectable} from 'inversify'

import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import coreTypes from '../coreTypes'
import ComicInfo from '../entities/ComicInfo'
import {ComicInfoStorageRepository} from '../interfaces/repositories'


@injectable()
export default class QueryComicInfosFromDatabaseUseCase implements AsyncUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  asyncExecute = async (request?: Request): Promise<Response | ResponseError> => {
    let searchTerm = ''
    if (request && request.data) {
      searchTerm = request.data
    }
    const comicInfos: ComicInfo[] = await this._comicInfoStorageRepository.asyncGetAllBySearchTerm(searchTerm)
    return new Response(comicInfos.map(comicInfo => comicInfo.serialize()))
  }
}
