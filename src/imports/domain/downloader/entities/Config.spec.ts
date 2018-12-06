import Config from './Config'

describe('Config', () => {
  describe('serialize', () => {
    it('will serialize the Config instance to json data', () => {
      const jsonData = {
        comicsFolder: 'comicsFolder',
        comicInfoStorePath: 'comicInfoStorePath',
      }

      const config = new Config(
        jsonData.comicsFolder,
        jsonData.comicInfoStorePath,
      )
      expect(config.serialize()).toEqual(jsonData)
    })
  })
})
