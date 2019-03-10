import ComicInfoFactory from '../factories/ComicInfoFactory'

describe('ComicInfo', () => {

  describe('serialize', () => {
    it('will serialize the ComicInfo instance to json data', () => {
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
        ]
      }

      const comicInfoFactory = new ComicInfoFactory()
      const comicInfo = comicInfoFactory.createFromJson(jsonData)
      expect(comicInfo.serialize()).toEqual(jsonData)
    })
  })
})
