import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import QueryComicInfosFromDatabaseUseCaseImpl from './QueryComicInfosFromDatabaseUseCaseImpl'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {ComicInfoRepository} from '../interfaces/repositories'

describe('QueryComicInfosFromDatabaseUseCaseImpl', () => {
  const comicInfoFactory = new ComicInfoFactoryImpl()
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
    }),
  ]

  describe('execute', () => {
    it('will get all comic infos from database without request object', async () => {
      const comicInfoInfoRepository: ComicInfoRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const uc = new QueryComicInfosFromDatabaseUseCaseImpl(comicInfoInfoRepository)
      const res = await uc.execute().toPromise()

      expect(comicInfoInfoRepository.asyncGetAllBySearchTerm).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfos.map(comicInfo => comicInfo.serialize()))
    })

    it('will get all comic infos from database with empty request object', async () => {
      const comicInfoInfoRepository: ComicInfoRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const uc = new QueryComicInfosFromDatabaseUseCaseImpl(comicInfoInfoRepository)
      const res = await uc.execute(new Request(undefined)).toPromise()

      expect(comicInfoInfoRepository.asyncGetAllBySearchTerm).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfos.map(comicInfo => comicInfo.serialize()))
    })

    it('will get filtered comic infos by search term from database', async () => {
      const filteredComicInfos = comicInfos.filter(comicInfo => comicInfo.name.includes('name-1'))

      const comicInfoInfoRepository: ComicInfoRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(filteredComicInfos)),
      }

      const uc = new QueryComicInfosFromDatabaseUseCaseImpl(comicInfoInfoRepository)
      const res = await uc.execute(new Request('name-1')).toPromise()

      expect(comicInfoInfoRepository.asyncGetAllBySearchTerm).toBeCalledWith('name-1')

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(filteredComicInfos.map(comicInfo => comicInfo.serialize()))
    })
  })
})
