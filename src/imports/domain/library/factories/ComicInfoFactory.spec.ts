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
    })
  })
})
