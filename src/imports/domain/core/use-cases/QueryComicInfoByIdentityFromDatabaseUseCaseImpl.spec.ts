import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import CoverImageFactoryImpl from '../factories/CoverImageFactoryImpl'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import QueryComicInfoByIdentityFromDatabaseUseCaseImpl from './QueryComicInfoByIdentityFromDatabaseUseCaseImpl'

describe('QueryComicInfoByIdentityFromDatabaseUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will get target comic info by identity from database', async () => {
      const comicInfoFactory = new ComicInfoFactoryImpl(new CoverImageFactoryImpl())
      const comicInfo = comicInfoFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverImage: {
          id: 'id',
          comicInfoId: 'id',
          mediaType: 'mediaType',
          base64Content: 'base64Content',
        },
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      })

      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(() => comicInfo),
        asyncGetAllBySearchTerm: jest.fn(),
      }

      const uc = new QueryComicInfoByIdentityFromDatabaseUseCaseImpl(comicInfoStorageRepository)
      const res = await uc.asyncExecute(new Request(comicInfo.identity))

      expect(comicInfoStorageRepository.asyncGetById).toBeCalledWith(comicInfo.identity)

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfo.serialize())
    })
  })
})
