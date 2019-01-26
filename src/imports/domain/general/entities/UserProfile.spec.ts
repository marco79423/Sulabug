import UserProfile from './UserProfile'

describe('UserProfile', () => {
  describe('serialize', () => {
    it('will serialize the UserProfile instance to json data', () => {
      const jsonData = {
        downloadFolderPath: 'downloadFolderPath',
      }

      const userProfile = new UserProfile(
        jsonData.downloadFolderPath,
      )
      expect(userProfile.serialize()).toEqual(jsonData)
    })
  })
})
