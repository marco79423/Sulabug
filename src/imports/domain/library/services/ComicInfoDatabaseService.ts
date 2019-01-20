import {inject, injectable} from 'inversify'

import {IComicInfoDatabaseService, IComicInfoRepository, ISFComicInfoQueryAdapter} from '../interfaces'
import libraryTypes from '../libraryTypes'
import ComicInfo from '../entities/ComicInfo'


@injectable()
export default class ComicInfoDatabaseService implements IComicInfoDatabaseService {
  private readonly _sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter
  private readonly _comicInfoRepository: IComicInfoRepository

  constructor(
    @inject(libraryTypes.SFComicInfoQueryAdapter) sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter,
    @inject(libraryTypes.ComicInfoInfoRepository) comicInfoRepository: IComicInfoRepository
  ) {
    this._sfComicInfoQueryAdapter = sfComicInfoQueryAdapter
    this._comicInfoRepository = comicInfoRepository
  }

  asyncUpdateAndReturn = async (): Promise<ComicInfo[]> => {
    const comicInfos = await this._sfComicInfoQueryAdapter.asyncQueryComicInfos()
    for (let comicInfo of comicInfos) {
      await this._comicInfoRepository.asyncSaveOrUpdate(comicInfo)
    }

    return await this._comicInfoRepository.asyncGetAllBySearchTerm('')
  }
}
