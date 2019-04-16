import {inject, injectable} from 'inversify'

import {
  IComicInfoDatabaseService,
  IComicInfoRepository,
  ISFComicInfoQueryAdapter, ITimeAdapter, IUserProfileFactory,
  IUserProfileRepository
} from '../interfaces'
import types from '../types'
import ComicInfo from '../entities/ComicInfo'

@injectable()
export default class ComicInfoDatabaseService implements IComicInfoDatabaseService {
  private readonly _sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _userProfileFactory: IUserProfileFactory
  private readonly _timeAdapter: ITimeAdapter

  constructor(
    @inject(types.SFComicInfoQueryAdapter) sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.UserProfileFactory) userProfileFactory: IUserProfileFactory,
    @inject(types.TimeAdapter) timeAdapter: ITimeAdapter,
  ) {
    this._sfComicInfoQueryAdapter = sfComicInfoQueryAdapter
    this._comicInfoRepository = comicInfoRepository
    this._userProfileRepository = userProfileRepository
    this._userProfileFactory = userProfileFactory
    this._timeAdapter = timeAdapter
  }

  asyncUpdateAndReturn = async (): Promise<ComicInfo[]> => {
    const comicInfos = await this._sfComicInfoQueryAdapter.asyncQueryComicInfos()
    for (let comicInfo of comicInfos) {
      await this._comicInfoRepository.asyncSaveOrUpdate(comicInfo)
    }

    const userProfile = await this._userProfileRepository.asyncGet()
    const newUserProfile = this._userProfileFactory.createFromJson({
      ...userProfile.serialize(),
      databaseUpdatedTime: this._timeAdapter.getNow().toISOString(),
    })
    await this._userProfileRepository.asyncSaveOrUpdate(newUserProfile)

    return await this._comicInfoRepository.asyncGetAllBySearchTerm('')
  }
}
