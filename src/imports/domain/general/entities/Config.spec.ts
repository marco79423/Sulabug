import Config from './Config'

describe('Config', () => {
  describe('serialize', () => {
    it('will serialize the Config instance to json data', () => {
      const jsonData = {
        downloadFolderPath: 'downloadFolderPath',
        comicInfoDatabasePath: 'comicInfoDatabasePath',
      }

      const config = new Config(
        jsonData.downloadFolderPath,
        jsonData.comicInfoDatabasePath,
      )
      expect(config.serialize()).toEqual(jsonData)
    })
  })
})
