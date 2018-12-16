import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import QueryComicInfoByIdentityFromDatabaseUseCaseImpl from './QueryComicInfoByIdentityFromDatabaseUseCaseImpl'

describe('QueryComicInfoByIdentityFromDatabaseUseCaseImpl', () => {
  describe('execute', () => {
    it('will get target comic info by identity from database', async () => {
      const comicInfoFactory = new ComicInfoFactoryImpl()
      const comicInfo = comicInfoFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      })

      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(() => Promise.resolve(comicInfo)),
        asyncGetAllBySearchTerm: jest.fn(),
      }

      const uc = new QueryComicInfoByIdentityFromDatabaseUseCaseImpl(comicInfoStorageRepository)
      const res = await uc.execute(new Request(comicInfo.identity)).toPromise()

      expect(comicInfoStorageRepository.asyncGetById).toBeCalledWith(comicInfo.identity)

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfo.serialize())
    })
  })
})
