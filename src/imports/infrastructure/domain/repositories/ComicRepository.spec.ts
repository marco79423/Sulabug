import 'reflect-metadata'

import IDatabase from '../../shared/interfaces'
import ComicFactory from '../../../domain/factories/ComicFactory'
import ComicRepository from './ComicRepository'

describe('ComicRepository', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target comic info into repository', async () => {
      const comicFactory = new ComicFactory()

      const comic = comicFactory.createFromJson({
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
        chapters: [],
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const comicRepository = new ComicRepository(
        comicFactory,
        database
      )

      await comicRepository.asyncSaveOrUpdate(comic)

      expect(database.asyncSaveOrUpdate).toBeCalledWith('comic', comic.serialize())
    })
  })

  describe('asyncGetById', () => {
    it('will get comic info by id', async () => {
      const comicFactory = new ComicFactory()

      const comic = comicFactory.createFromJson({
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
        chapters: [],
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => comic.serialize()),
      }

      const comicRepository = new ComicRepository(
        comicFactory,
        database
      )

      const result = await comicRepository.asyncGetById('id')

      expect(database.asyncFindOne).toBeCalledWith('comic', {
        id: 'id'
      })

      expect(result.serialize()).toEqual(comic.serialize())
    })

    it('will get null when there is no comic info with the same id', async () => {
      const comicFactory = new ComicFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const comicRepository = new ComicRepository(
        comicFactory,
        database
      )

      await expect(comicRepository.asyncGetById('id'))
        .rejects.toThrow(new Error('Target comic info not found'))

      expect(database.asyncFindOne).toBeCalledWith('comic', {
        id: 'id'
      })
    })
  })

  describe('asyncGetAllBySearchTerm', () => {
    it('will get filtered comic info with search term', async () => {
      const comicFactory = new ComicFactory()

      const comic = comicFactory.createFromJson({
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
        chapters: [],
      })

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(() => [comic.serialize()]),
        asyncFindOne: jest.fn(),
      }

      const comicRepository = new ComicRepository(
        comicFactory,
        database
      )

      const result = await comicRepository.asyncGetAllBySearchTerm('searchTerm')

      expect(database.asyncFind).toBeCalledWith('comic', {
        name: {
          $regex: `.*searchTerm.*`,
        }
      })

      expect(result).toEqual([comic])
    })
  })
})
