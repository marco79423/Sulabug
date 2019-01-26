import 'reflect-metadata'

import UserProfileFactory from './UserProfileFactory'

describe('UserProfileFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new UserProfile instance from json data', () => {
      const userProfileData = {
        downloadFolderPath: 'downloadFolderPath',
      }

      const userProfileFactory = new UserProfileFactory()
      const userProfile = userProfileFactory.createFromJson(userProfileData)
      expect(userProfile.identity).toBe(null)
      expect(userProfile.downloadFolderPath).toBe(userProfileData.downloadFolderPath)
    })
  })
})
