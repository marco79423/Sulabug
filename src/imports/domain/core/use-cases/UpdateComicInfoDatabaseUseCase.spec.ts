import 'reflect-metadata'

import {Response} from '../../base-types'
import UpdateComicInfoDatabaseUseCase from './UpdateComicInfoDatabaseUseCase'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import CoverImageFactoryImpl from '../factories/CoverImageFactoryImpl'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {SFComicInfoQueryService} from '../interfaces/services'

describe('UpdateComicInfoDatabaseUseCase', () => {
  describe('asyncExecute', () => {
    it('will retrieve comic infos from SF site to database', async () => {
      const comicInfoFactory = new ComicInfoFactoryImpl(new CoverImageFactoryImpl())
      const comicInfos = [
        comicInfoFactory.createFromJson({
          id: 'id-1',
          name: 'name-1',
          coverImage: {
            id: 'id-1',
            comicInfoId: 'id-1',
            mediaType: 'mediaType-1',
            base64Content: 'base64Content-1',
          },
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
          coverImage: {
            id: 'id-2',
            comicInfoId: 'id-2',
            mediaType: 'mediaType-2',
            base64Content: 'base64Content-2',
          },
          source: 'source-2',
          pageUrl: 'pageUrl-2',
          catalog: 'catalog-2',
          author: 'author-2',
          lastUpdated: 'lastUpdated-2',
          summary: 'summary-2',
        }),
      ]

      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(),
      }

      const sfComicInfoQueryService: SFComicInfoQueryService = {
        asyncQuery: jest.fn(() => comicInfos),
      }

      const uc = new UpdateComicInfoDatabaseUseCase(comicInfoStorageRepository, sfComicInfoQueryService)
      const res = await uc.asyncExecute()

      expect(sfComicInfoQueryService.asyncQuery).toBeCalled()

      expect(comicInfoStorageRepository.asyncSaveOrUpdate).toBeCalledWith(comicInfos[0])
      expect(comicInfoStorageRepository.asyncSaveOrUpdate).toBeCalledWith(comicInfos[1])

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
