import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import UpdateConfigUseCase from './UpdateConfigUseCase'
import ConfigFactoryImpl from '../factories/ConfigFactoryImpl'
import {ConfigRepository} from '../interfaces/repositories'

describe('UpdateConfigUseCase', () => {
  describe('asyncExecute', () => {
    it('will update configuration by the request', async () => {
      const configData = {
        comicsFolder: 'comicsFolder',
        comicInfoStorePath: 'comicInfoStorePath',
      }
      const request = new Request(configData)

      const configFactory = new ConfigFactoryImpl()
      const configRepository: ConfigRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGet: jest.fn(),
      }
      const uc = new UpdateConfigUseCase(configFactory, configRepository)
      const res = await uc.asyncExecute(request)

      expect(configRepository.asyncSaveOrUpdate).toBeCalledWith(configFactory.createFromJson(configData))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
