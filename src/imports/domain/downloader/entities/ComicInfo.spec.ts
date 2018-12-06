import ComicInfoFactoryImpl from '../factories/ComicInfoFactoryImpl'
import {CoverImageFactory} from '../interfaces/factories'

describe('ComicInfo', () => {

  describe('serialize', () => {
    it('will serialize the ComicInfo instance to json data', () => {
      const jsonData = {
        id: 'id',
        name: 'name',
        coverImage: {
          id: 'id',
          comicInfoId: 'comicInfoId',
          mediaType: 'mediaType',
          base64Content: 'base64Content',
        },
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      }

      const coverImageFactory: CoverImageFactory = {
        createFromJson: jest.fn(() => ({
          serialize: jest.fn(() => jsonData.coverImage)
        }))
      }

      const comicInfoFactory = new ComicInfoFactoryImpl(coverImageFactory)
      const comicInfo = comicInfoFactory.createFromJson(jsonData)
      expect(comicInfo.serialize()).toEqual(jsonData)
    })
  })
})
