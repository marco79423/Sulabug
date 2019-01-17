import 'reflect-metadata'

import IDatabase from '../../../shared/interfaces'
import {ComicInfoCollection} from '../../../shared/database/collections'
import ComicInfoFactoryImpl from '../../../../domain/library/factories/ComicInfoFactoryImpl'
import ComicInfoRepositoryImpl from './ComicInfoRepositoryImpl'

describe('ComicInfoRepositoryImpl', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target comic info into repository', async () => {
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

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const comicInfoRepositoryImpl = new ComicInfoRepositoryImpl(
        comicInfoFactory,
        database
      )

      await comicInfoRepositoryImpl.asyncSaveOrUpdate(comicInfo)

      expect(database.asyncSaveOrUpdate).toBeCalledWith(ComicInfoCollection.name, comicInfo.serialize())
    })
  })

  describe('asyncGetById', () => {
    it('will get comic info by id', async () => {
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

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => comicInfo.serialize()),
      }

      const comicInfoRepositoryImpl = new ComicInfoRepositoryImpl(
        comicInfoFactory,
        database
      )

      const result = await comicInfoRepositoryImpl.asyncGetById('id')

      expect(database.asyncFindOne).toBeCalledWith(ComicInfoCollection.name, {
        id: 'id'
      })

      expect(result.serialize()).toEqual(comicInfo.serialize())
    })

    it('will get null when there is no comic info with the same id', async () => {
      const comicInfoFactory = new ComicInfoFactoryImpl()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const comicInfoRepositoryImpl = new ComicInfoRepositoryImpl(
        comicInfoFactory,
        database
      )

      await expect(comicInfoRepositoryImpl.asyncGetById('id'))
        .rejects.toThrow(new Error('Target comic info not found'))

      expect(database.asyncFindOne).toBeCalledWith(ComicInfoCollection.name, {
        id: 'id'
      })
    })
  })

  describe('asyncGetAllBySearchTerm', () => {
    it('will get filtered comic info with search term', async () => {
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

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(() => [comicInfo.serialize()]),
        asyncFindOne: jest.fn(),
      }

      const comicInfoRepositoryImpl = new ComicInfoRepositoryImpl(
        comicInfoFactory,
        database
      )

      const result = await comicInfoRepositoryImpl.asyncGetAllBySearchTerm('searchTerm')

      expect(database.asyncFind).toBeCalledWith(ComicInfoCollection.name, {
        name: {
          $regex: `.*searchTerm.*`,
        }
      })

      expect(result).toEqual([comicInfo])
    })
  })
})
