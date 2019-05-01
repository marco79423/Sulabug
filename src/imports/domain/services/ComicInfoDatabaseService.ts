import {inject, injectable} from 'inversify'

import {
  IComicInfoDatabaseService, IComicInfoFactory,
  IComicInfoRepository,
  IComicSourceSiteService,
  ITimeAdapter,
  IUserProfileFactory,
  IUserProfileRepository
} from '../interfaces'
import types from '../types'
import ComicInfo from '../entities/ComicInfo'

@injectable()
export default class ComicInfoDatabaseService implements IComicInfoDatabaseService {
  private readonly _sfComicSourceSiteService: IComicSourceSiteService
  private readonly _comicInfoFactory: IComicInfoFactory
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _userProfileFactory: IUserProfileFactory
  private readonly _timeAdapter: ITimeAdapter

  constructor(
    @inject(types.SFComicSourceSiteService) sfComicSourceSiteService: IComicSourceSiteService,
    @inject(types.ComicInfoFactory) comicInfoFactory: IComicInfoFactory,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.UserProfileFactory) userProfileFactory: IUserProfileFactory,
    @inject(types.TimeAdapter) timeAdapter: ITimeAdapter,
  ) {
    this._sfComicSourceSiteService = sfComicSourceSiteService
    this._comicInfoFactory = comicInfoFactory
    this._comicInfoRepository = comicInfoRepository
    this._userProfileRepository = userProfileRepository
    this._userProfileFactory = userProfileFactory
    this._timeAdapter = timeAdapter
  }

  asyncUpdateAndReturn = async (): Promise<ComicInfo[]> => {
    const comicSources = await this._sfComicSourceSiteService.asyncGetAllComicSources()
    for (let comicSource of comicSources) {
      const coverDataUrl = await comicSource.asyncGetCoverDataUrl()
      const catalog = await comicSource.asyncGetCatalog()
      const author = await comicSource.asyncGetAuthor()
      const lastUpdatedChapter = await comicSource.asyncGetLastUpdatedChapter()
      const lastUpdatedTime = await comicSource.asyncGetLastUpdatedTime()
      const summary = await comicSource.asyncGetSummary()
      const chapters = await comicSource.asyncGetChapters()

      await this._comicInfoRepository.asyncSaveOrUpdate(this._comicInfoFactory.createFromJson({
        id: comicSource.name,
        name: comicSource.name,
        coverDataUrl: coverDataUrl,
        source: comicSource.source,
        pageUrl: comicSource.pageUrl,
        catalog: catalog,
        author: author,
        lastUpdatedChapter: lastUpdatedChapter,
        lastUpdatedTime: lastUpdatedTime.toISOString(),
        summary: summary,
        chapters: chapters.map(chapter => chapter.serialize())
      }))
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
