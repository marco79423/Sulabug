import UserProfile from './UserProfile'

describe('UserProfile', () => {
  describe('serialize', () => {
    it('will serialize the UserProfile instance to json data', () => {
      const jsonData = {
        databaseUpdatedTime: '2019-01-01T00:00:00.000Z',
        downloadFolderPath: 'downloadFolderPath',
      }

      const userProfile = new UserProfile(
        new Date(jsonData.databaseUpdatedTime),
        jsonData.downloadFolderPath,
      )
      expect(userProfile.serialize()).toEqual(jsonData)
    })
  })
})
