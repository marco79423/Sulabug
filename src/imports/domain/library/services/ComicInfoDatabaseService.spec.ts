import 'reflect-metadata'
import {IComicInfoRepository, ISFComicInfoQueryAdapter} from '../interfaces'
import ComicInfoDatabaseService from './ComicInfoDatabaseService'
import ComicInfoFactory from '../factories/ComicInfoFactory'

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
          lastUpdated: 'lastUpdated-1',
          summary: 'summary-1',
        }),
        comicInfoFactory.createFromJson({
          id: 'id-2',
          name: 'name-2',
          coverDataUrl: 'coverDataUrl-2',
          source: 'source-2',
          pageUrl: 'pageUrl-2',
          catalog: 'catalog-2',
          author: 'author-2',
          lastUpdated: 'lastUpdated-2',
          summary: 'summary-2',
        })
      ]

      const sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter = {
        asyncQueryComicInfos: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const comicInfoInfoRepository: IComicInfoRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(),
      }

      const comicInfoQueryService = new ComicInfoDatabaseService(
        sfComicInfoQueryAdapter,
        comicInfoInfoRepository
      )

      await comicInfoQueryService.asyncUpdate()
      expect(sfComicInfoQueryAdapter.asyncQueryComicInfos).toHaveBeenCalled()

      expect(comicInfoInfoRepository.asyncSaveOrUpdate).toHaveBeenCalledWith(comicInfos[0])
      expect(comicInfoInfoRepository.asyncSaveOrUpdate).toHaveBeenCalledWith(comicInfos[1])
    })
  })
})
