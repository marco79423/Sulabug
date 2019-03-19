import ComicInfoFactory from './ComicInfoFactory'

describe('ComicInfoFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new ComicInfo instance from json data', () => {
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

      const factory = new ComicInfoFactory()
      const comicInfo = factory.createFromJson(jsonData)
      expect(comicInfo.identity).toBe(jsonData.id)
      expect(comicInfo.name).toBe(jsonData.name)
      expect(comicInfo.coverDataUrl).toBe(jsonData.coverDataUrl)
      expect(comicInfo.source).toBe(jsonData.source)
      expect(comicInfo.pageUrl).toBe(jsonData.pageUrl)
      expect(comicInfo.catalog).toBe(jsonData.catalog)
      expect(comicInfo.author).toBe(jsonData.author)
      expect(comicInfo.lastUpdatedChapter).toBe(jsonData.lastUpdatedChapter)
      expect(comicInfo.lastUpdatedTime.toISOString()).toBe(jsonData.lastUpdatedTime)
      expect(comicInfo.summary).toBe(jsonData.summary)

      expect(comicInfo.chapters[0].identity).toEqual(jsonData.chapters[0].id)
      expect(comicInfo.chapters[0].order).toEqual(jsonData.chapters[0].order)
      expect(comicInfo.chapters[0].name).toEqual(jsonData.chapters[0].name)
      expect(comicInfo.chapters[0].sourcePageUrl).toEqual(jsonData.chapters[0].sourcePageUrl)
    })
  })
})
