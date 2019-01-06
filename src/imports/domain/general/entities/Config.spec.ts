import Config from './Config'

describe('Config', () => {
  describe('serialize', () => {
    it('will serialize the Config instance to json data', () => {
      const jsonData = {
        downloadFolderPath: 'downloadFolderPath',
      }

      const config = new Config(
        jsonData.downloadFolderPath,
      )
      expect(config.serialize()).toEqual(jsonData)
    })
  })
})
