import ComicFactory from '../factories/ComicFactory'

describe('Comic', () => {

  describe('serialize', () => {
    it('will serialize the Comic instance to json data', () => {
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

      const comicFactory = new ComicFactory()
      const comic = comicFactory.createFromJson(jsonData)
      expect(comic.serialize()).toEqual(jsonData)
    })
  })
})
