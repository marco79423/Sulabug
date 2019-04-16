import 'reflect-metadata'

import UserProfileFactory from './UserProfileFactory'

describe('UserProfileFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new UserProfile instance from json data', () => {
      const userProfileData = {
        databaseUpdatedTime: '2019-01-01T00:00:00Z',
        downloadFolderPath: 'downloadFolderPath',
      }

      const userProfileFactory = new UserProfileFactory()
      const userProfile = userProfileFactory.createFromJson(userProfileData)
      expect(userProfile.identity).toBe(null)
      expect(userProfile.downloadFolderPath).toBe(userProfileData.downloadFolderPath)
    })
  })
})
