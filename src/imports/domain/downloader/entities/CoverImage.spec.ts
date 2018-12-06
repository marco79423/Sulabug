import 'reflect-metadata'

import CoverImage from './CoverImage'

describe('CoverImage', () => {
  describe('serialize', () => {
    it('will serialize the CoverImage instance to json data', () => {
      const jsonData = {
        id: 'id',
        comicInfoId: 'comicInfoId',
        mediaType: 'mediaType',
        base64Content: 'base64Content',
      }

      const coverImage = new CoverImage(
        jsonData.id,
        jsonData.comicInfoId,
        jsonData.mediaType,
        jsonData.base64Content,
      )
      expect(coverImage.serialize()).toEqual(jsonData)
    })
  })
})
