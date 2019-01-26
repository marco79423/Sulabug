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
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      }

      const comicInfoFactory = new ComicInfoFactory()
      const comicInfo = comicInfoFactory.createFromJson(jsonData)
      expect(comicInfo.serialize()).toEqual(jsonData)
    })
  })
})
