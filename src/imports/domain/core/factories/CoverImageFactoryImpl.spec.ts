import 'reflect-metadata'

import CoverImageFactoryImpl from './CoverImageFactoryImpl'

describe('CoverImageFactoryImpl', () => {
  describe('createFromJson', () => {
    it('will generate a new CoverImage instance from json data', () => {
      const jsonData = {
        id: 'id',
        comicInfoId: 'comicInfoId',
        mediaType: 'mediaType',
        base64Content: 'base64Content',
      }

      const coverImageFactory = new CoverImageFactoryImpl()
      const coverImage = coverImageFactory.createFromJson(jsonData)
      expect(coverImage.identity).toBe(jsonData.id)
      expect(coverImage.comicInfoIdentity).toBe(jsonData.comicInfoId)
      expect(coverImage.mediaType).toBe(jsonData.mediaType)
      expect(coverImage.base64Content).toBe(jsonData.base64Content)
    })
  })
})
