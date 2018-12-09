import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import UpdateConfigUseCaseImpl from './UpdateConfigUseCaseImpl'
import ConfigFactoryImpl from '../factories/ConfigFactoryImpl'
import {ConfigRepository} from '../interfaces/repositories'

describe('UpdateConfigUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will update configuration by the request', async () => {
      const configData = {
        downloadFolderPath: 'downloadFolderPath',
        comicInfoDatabasePath: 'comicInfoDatabasePath',
      }
      const request = new Request(configData)

      const configFactory = new ConfigFactoryImpl()
      const configRepository: ConfigRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGet: jest.fn(),
      }
      const uc = new UpdateConfigUseCaseImpl(configFactory, configRepository)
      const res = await uc.asyncExecute(request)

      expect(configRepository.asyncSaveOrUpdate).toBeCalledWith(configFactory.createFromJson(configData))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
