import ComicFactory from './ComicFactory'
import {IComicSourceFactory} from '../interfaces'

describe('ComicFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new Comic instance from json data', () => {
      const jsonData = {
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
        chapters: [
          {
            id: 'id',
            order: 0,
            name: 'name',
            sourcePageUrl: 'sourcePageUrl',
          }
        ],
      }

      const comicSourceFactory: IComicSourceFactory = {
        createFromJson: jest.fn()
      }

      const factory = new ComicFactory(comicSourceFactory)
      const comic = factory.createFromJson(jsonData)
      expect(comic.identity).toBe(jsonData.id)
      expect(comic.name).toBe(jsonData.name)
      expect(comic.coverDataUrl).toBe(jsonData.coverDataUrl)
      expect(comic.source).toBe(jsonData.source)
      expect(comic.pageUrl).toBe(jsonData.pageUrl)
      expect(comic.catalog).toBe(jsonData.catalog)
      expect(comic.author).toBe(jsonData.author)
      expect(comic.lastUpdatedChapter).toBe(jsonData.lastUpdatedChapter)
      expect(comic.lastUpdatedTime.toISOString()).toBe(jsonData.lastUpdatedTime)
      expect(comic.summary).toBe(jsonData.summary)

      expect(comic.chapters[0].identity).toEqual(jsonData.chapters[0].id)
      expect(comic.chapters[0].order).toEqual(jsonData.chapters[0].order)
      expect(comic.chapters[0].name).toEqual(jsonData.chapters[0].name)
      expect(comic.chapters[0].sourcePageUrl).toEqual(jsonData.chapters[0].sourcePageUrl)
    })
  })
})
