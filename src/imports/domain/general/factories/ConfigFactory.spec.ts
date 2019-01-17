import 'reflect-metadata'

import ConfigFactory from './ConfigFactory'

describe('ConfigFactory', () => {
  describe('createFromJson', () => {
    it('will generate a new Config instance from json data', () => {
      const jsonData = {
        downloadFolderPath: 'downloadFolderPath',
      }

      const configFactory = new ConfigFactory()
      const config = configFactory.createFromJson(jsonData)
      expect(config.identity).toBe(null)
      expect(config.downloadFolderPath).toBe(jsonData.downloadFolderPath)
    })
  })
})
