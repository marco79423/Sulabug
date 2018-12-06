import {inject, injectable} from 'inversify'

import {Response} from '../../base-types'
import coreTypes from '../coreTypes'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {SFComicSiteService} from '../interfaces/services'
import {UpdateComicInfoDatabaseUseCase} from '../interfaces/use-cases'

@injectable()
export default class UpdateComicInfoDatabaseUseCaseImpl implements UpdateComicInfoDatabaseUseCase {
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository
  private readonly _sfComicSiteService: SFComicSiteService

  public constructor(
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository,
    @inject(coreTypes.SFComicSiteService) sfComicSiteService: SFComicSiteService,
  ) {
    this._comicInfoStorageRepository = comicInfoStorageRepository
    this._sfComicSiteService = sfComicSiteService
  }

  async asyncExecute(): Promise<Response> {
    const comicInfos = await this._sfComicSiteService.asyncGetComicInfos()
    for (let comicInfo of comicInfos) {
      await this._comicInfoStorageRepository.asyncSaveOrUpdate(comicInfo)
    }
    return new Response()
  }
}
