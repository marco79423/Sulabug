import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import QueryComicInfosFromDatabaseUseCase from './QueryComicInfosFromDatabaseUseCase'
import CoverImageFactoryImpl from '../factories/CoverImageFactoryImpl'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {ComicInfoStorageRepository} from '../interfaces/repositories'

describe('QueryComicInfosFromDatabaseUseCase', () => {
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

  describe('asyncExecute', () => {
    it('will get all comic infos from database without request object', async () => {
      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => comicInfos),
      }

      const uc = new QueryComicInfosFromDatabaseUseCase(comicInfoStorageRepository)
      const res = await uc.asyncExecute()

      expect(comicInfoStorageRepository.asyncGetAllBySearchTerm).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfos.map(comicInfo => comicInfo.serialize()))
    })

    it('will get all comic infos from database with empty request object', async () => {
      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => comicInfos),
      }

      const uc = new QueryComicInfosFromDatabaseUseCase(comicInfoStorageRepository)
      const res = await uc.asyncExecute(new Request(undefined))

      expect(comicInfoStorageRepository.asyncGetAllBySearchTerm).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(comicInfos.map(comicInfo => comicInfo.serialize()))
    })

    it('will get filtered comic infos by search term from database', async () => {
      const filteredComicInfos = comicInfos.filter(comicInfo => comicInfo.name.includes('name-1'))

      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(() => filteredComicInfos),
      }

      const uc = new QueryComicInfosFromDatabaseUseCase(comicInfoStorageRepository)
      const res = await uc.asyncExecute(new Request('name-1'))

      expect(comicInfoStorageRepository.asyncGetAllBySearchTerm).toBeCalledWith('name-1')

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(filteredComicInfos.map(comicInfo => comicInfo.serialize()))
    })
  })
})
