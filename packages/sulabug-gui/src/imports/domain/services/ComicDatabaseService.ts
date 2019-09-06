import {inject, injectable} from 'inversify'

import {
  IComicDatabaseService, IComicFactory,
  IComicRepository,
  IComicSourceSiteService,
  ITimeAdapter,
  IUserProfileFactory,
  IUserProfileRepository
} from '../interfaces'
import types from '../types'
import Comic from '../entities/Comic'

@injectable()
export default class ComicDatabaseService implements IComicDatabaseService {
  private readonly _sfComicSourceSiteService: IComicSourceSiteService
  private readonly _comicFactory: IComicFactory
  private readonly _comicRepository: IComicRepository
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _userProfileFactory: IUserProfileFactory
  private readonly _timeAdapter: ITimeAdapter

  constructor(
    @inject(types.SFComicSourceSiteService) sfComicSourceSiteService: IComicSourceSiteService,
    @inject(types.ComicFactory) comicFactory: IComicFactory,
    @inject(types.ComicRepository) comicRepository: IComicRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.UserProfileFactory) userProfileFactory: IUserProfileFactory,
    @inject(types.TimeAdapter) timeAdapter: ITimeAdapter,
  ) {
    this._sfComicSourceSiteService = sfComicSourceSiteService
    this._comicFactory = comicFactory
    this._comicRepository = comicRepository
    this._userProfileRepository = userProfileRepository
    this._userProfileFactory = userProfileFactory
    this._timeAdapter = timeAdapter
  }

  asyncUpdateAndReturn = async (): Promise<Comic[]> => {
    const comicSources = await this._sfComicSourceSiteService.asyncGetAllComicSources()
    for (let comicSource of comicSources) {

      const coverDataUrl = await comicSource.asyncGetCoverDataUrl()
      const catalog = await comicSource.asyncGetCatalog()
      const author = await comicSource.asyncGetAuthor()
      const lastUpdatedChapter = await comicSource.asyncGetLastUpdatedChapter()
      const lastUpdatedTime = await comicSource.asyncGetLastUpdatedTime()
      const summary = await comicSource.asyncGetSummary()
      const chapters = await comicSource.asyncGetChapters()

      const comic = await this._comicRepository.asyncGetById(comicSource.id)
      let inCollection = false
      if (comic) {
        inCollection = comic.inCollection
      }

      await this._comicRepository.asyncSaveOrUpdate(this._comicFactory.createFromJson({
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
        chapters: chapters.map(chapter => chapter.serialize()),
        inCollection: inCollection
      }))
    }

    const userProfile = await this._userProfileRepository.asyncGet()
    const newUserProfile = this._userProfileFactory.createFromJson({
      ...userProfile.serialize(),
      databaseUpdatedTime: this._timeAdapter.getNow().toISOString(),
    })
    await this._userProfileRepository.asyncSaveOrUpdate(newUserProfile)

    return await this._comicRepository.asyncGetAllBySearchTerm('')
  }
}
