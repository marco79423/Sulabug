import 'reflect-metadata'

import {Response} from '../../base-types'
import UpdateComicInfoDatabaseUseCaseImpl from './UpdateComicInfoDatabaseUseCaseImpl'
import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {ComicInfoStorageRepository} from '../interfaces/repositories'
import {SFComicInfoQueryAdapter} from '../interfaces/adapters'

describe('UpdateComicInfoDatabaseUseCaseImpl', () => {
  describe('execute', () => {
    it('will retrieve comic infos from SF site to database', async () => {
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

      const comicInfoStorageRepository: ComicInfoStorageRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGetById: jest.fn(),
        asyncGetAllBySearchTerm: jest.fn(),
      }

      const sfComicInfoQueryAdapter: SFComicInfoQueryAdapter = {
        asyncGetComicInfos: jest.fn(() => Promise.resolve(comicInfos)),
      }

      const uc = new UpdateComicInfoDatabaseUseCaseImpl(comicInfoStorageRepository, sfComicInfoQueryAdapter)
      const res = await uc.execute().toPromise()

      expect(sfComicInfoQueryAdapter.asyncGetComicInfos).toBeCalled()

      expect(comicInfoStorageRepository.asyncSaveOrUpdate).toBeCalledWith(comicInfos[0])
      expect(comicInfoStorageRepository.asyncSaveOrUpdate).toBeCalledWith(comicInfos[1])

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
