import 'reflect-metadata'
import {IComicInfoRepository, ISFComicInfoQueryAdapter, ITimeAdapter, IUserProfileRepository} from '../interfaces'
import ComicInfoDatabaseService from './ComicInfoDatabaseService'
import ComicInfoFactory from '../factories/ComicInfoFactory'
import UserProfileFactory from '../factories/UserProfileFactory'
import UserProfile from '../entities/UserProfile'

describe('ComicInfoDatabaseService', () => {

  describe('asyncUpdate', () => {
    it('will update comic info database from network', async () => {
      const comicInfoFactory = new ComicInfoFactory()
      const comicInfos = [
        comicInfoFactory.createFromJson({
          id: 'id-1',
          name: 'name-1',
          coverDataUrl: 'coverDataUrl-1',
          source: 'source-1',
          pageUrl: 'pageUrl-1',
          catalog: 'catalog-1',
          author: 'author-1',
          lastUpdatedChapter: 'lastUpdatedChapter-1',
          lastUpdatedTime: '2019-01-16T00:00:00.000Z',
          summary: 'summary-1',
          chapters: [],
        }),
        comicInfoFactory.createFromJson({
          id: 'id-2',
          name: 'name-2',
          coverDataUrl: 'coverDataUrl-2',
          source: 'source-2',
          pageUrl: 'pageUrl-2',
          catalog: 'catalog-2',
          author: 'author-2',
          lastUpdatedChapter: 'lastUpdatedChapter-1',
          lastUpdatedTime: '2019-01-17T00:00:00.000Z',
          summary: 'summary-2',
          chapters: [],
        })
      ]

      const sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter = {
        asyncQueryComicInfos: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const comicInfoInfoRepository: IComicInfoRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const userProfileFactory = new UserProfileFactory()
      const userProfile = new UserProfile(
        new Date('2019-01-01T00:00:00Z'),
        'comicsFolder',
      )

      const userProfileRepository: IUserProfileRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGet: jest.fn(() => Promise.resolve(userProfile)),
      }

      const timeAdapter: ITimeAdapter = {
        getNow: jest.fn(() => new Date('2019-01-02T00:00:00Z')),
      }

      const comicInfoQueryService = new ComicInfoDatabaseService(
        sfComicInfoQueryAdapter,
        comicInfoInfoRepository,
        userProfileRepository,
        userProfileFactory,
        timeAdapter
      )

      const result = await comicInfoQueryService.asyncUpdateAndReturn()
      expect(result).toBe(comicInfos)

      expect(comicInfoInfoRepository.asyncSaveOrUpdate).toHaveBeenCalledWith(comicInfos[0])
      expect(comicInfoInfoRepository.asyncSaveOrUpdate).toHaveBeenCalledWith(comicInfos[1])
    })
  })
})
