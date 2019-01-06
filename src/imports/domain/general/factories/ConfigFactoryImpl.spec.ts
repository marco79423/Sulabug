import 'reflect-metadata'

import ConfigFactoryImpl from './ConfigFactoryImpl'

describe('ConfigFactoryImpl', () => {
  describe('createFromJson', () => {
    it('will generate a new Config instance from json data', () => {
      const jsonData = {
        downloadFolderPath: 'downloadFolderPath',
      }

      const configFactory = new ConfigFactoryImpl()
      const config = configFactory.createFromJson(jsonData)
      expect(config.identity).toBe(null)
      expect(config.downloadFolderPath).toBe(jsonData.downloadFolderPath)
    })
  })
})
