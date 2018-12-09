import ComicInfoFactoryImpl from './ComicInfoFactoryImpl'

describe('ComicInfoFactoryImpl', () => {
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
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      }

      const factory = new ComicInfoFactoryImpl()
      const comicInfo = factory.createFromJson(jsonData)
      expect(comicInfo.identity).toBe(jsonData.id)
      expect(comicInfo.name).toBe(jsonData.name)
      expect(comicInfo.coverDataUrl).toBe(jsonData.coverDataUrl)
      expect(comicInfo.source).toBe(jsonData.source)
      expect(comicInfo.pageUrl).toBe(jsonData.pageUrl)
      expect(comicInfo.catalog).toBe(jsonData.catalog)
      expect(comicInfo.author).toBe(jsonData.author)
      expect(comicInfo.lastUpdated).toBe(jsonData.lastUpdated)
      expect(comicInfo.summary).toBe(jsonData.summary)
    })
  })
})
