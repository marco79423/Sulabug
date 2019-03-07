import 'reflect-metadata'

import IDatabase from '../../../shared/interfaces'
import {ComicInfoCollection} from '../../../shared/database/collections'
import ComicInfoFactory from '../../../../domain/library/factories/ComicInfoFactory'
import ComicInfoRepository from './ComicInfoRepository'

describe('ComicInfoRepository', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target comic info into repository', async () => {
      const comicInfoFactory = new ComicInfoFactory()

      const comicInfo = comicInfoFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdatedChapter: 'lastUpdatedChapter',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary',
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const comicInfoRepository = new ComicInfoRepository(
        comicInfoFactory,
        database
      )

      await comicInfoRepository.asyncSaveOrUpdate(comicInfo)

      expect(database.asyncSaveOrUpdate).toBeCalledWith(ComicInfoCollection.name, comicInfo.serialize())
    })
  })

  describe('asyncGetById', () => {
    it('will get comic info by id', async () => {
      const comicInfoFactory = new ComicInfoFactory()

      const comicInfo = comicInfoFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdatedChapter: 'lastUpdatedChapter',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary',
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => comicInfo.serialize()),
      }

      const comicInfoRepository = new ComicInfoRepository(
        comicInfoFactory,
        database
      )

      const result = await comicInfoRepository.asyncGetById('id')

      expect(database.asyncFindOne).toBeCalledWith(ComicInfoCollection.name, {
        id: 'id'
      })

      expect(result.serialize()).toEqual(comicInfo.serialize())
    })

    it('will get null when there is no comic info with the same id', async () => {
      const comicInfoFactory = new ComicInfoFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const comicInfoRepository = new ComicInfoRepository(
        comicInfoFactory,
        database
      )

      await expect(comicInfoRepository.asyncGetById('id'))
        .rejects.toThrow(new Error('Target comic info not found'))

      expect(database.asyncFindOne).toBeCalledWith(ComicInfoCollection.name, {
        id: 'id'
      })
    })
  })

  describe('asyncGetAllBySearchTerm', () => {
    it('will get filtered comic info with search term', async () => {
      const comicInfoFactory = new ComicInfoFactory()

      const comicInfo = comicInfoFactory.createFromJson({
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdatedChapter: 'lastUpdatedChapter',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary',
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(() => [comicInfo.serialize()]),
        asyncFindOne: jest.fn(),
      }

      const comicInfoRepository = new ComicInfoRepository(
        comicInfoFactory,
        database
      )

      const result = await comicInfoRepository.asyncGetAllBySearchTerm('searchTerm')

      expect(database.asyncFind).toBeCalledWith(ComicInfoCollection.name, {
        name: {
          $regex: `.*searchTerm.*`,
        }
      })

      expect(result).toEqual([comicInfo])
    })
  })
})
