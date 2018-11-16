import ComicInfoFactoryImpl from './ComicInfoFactoryImpl'
import {CoverImageFactory} from '../interfaces/factories'

describe('ComicInfoFactoryImpl', () => {
  describe('createFromJson', () => {
    it('will generate a new ComicInfo instance from json data', () => {
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
      const factory = new ComicInfoFactoryImpl(coverImageFactory)
      const comicInfo = factory.createFromJson(jsonData)
      expect(comicInfo.identity).toBe(jsonData.id)
      expect(comicInfo.name).toBe(jsonData.name)
      expect(comicInfo.coverImage.serialize()).toEqual(jsonData.coverImage)
      expect(comicInfo.source).toBe(jsonData.source)
      expect(comicInfo.pageUrl).toBe(jsonData.pageUrl)
      expect(comicInfo.catalog).toBe(jsonData.catalog)
      expect(comicInfo.author).toBe(jsonData.author)
      expect(comicInfo.lastUpdated).toBe(jsonData.lastUpdated)
      expect(comicInfo.summary).toBe(jsonData.summary)
    })
  })
})
