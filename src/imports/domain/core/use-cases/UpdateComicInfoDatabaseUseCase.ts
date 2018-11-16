import {inject, injectable} from 'inversify'

import {AsyncUseCase, Response, ResponseError} from '../../base-types'
import coreTypes from '../coreTypes'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {SFComicInfoQueryService} from '../interfaces/services'

@injectable()
export default class UpdateComicInfoDatabaseUseCase implements AsyncUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository
  private readonly _sfComicInfoQueryService: SFComicInfoQueryService

  public constructor(
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository,
    @inject(coreTypes.SFComicInfoQueryService) sfComicInfoQueryService: SFComicInfoQueryService,
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
    this._sfComicInfoQueryService = sfComicInfoQueryService
  }

  asyncExecute = async (): Promise<Response | ResponseError> => {
    const comicInfos = await this._sfComicInfoQueryService.asyncQuery()
    for (let comicInfo of comicInfos) {
      await this._comicInfoStorageRepository.asyncSaveOrUpdate(comicInfo)
    }
    return new Response()
  }
}
