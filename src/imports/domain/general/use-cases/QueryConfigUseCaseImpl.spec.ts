import 'reflect-metadata'

import {Response} from '../../base-types'
import QueryConfigUseCaseImpl from './QueryConfigUseCaseImpl'
import ConfigFactoryImpl from '../factories/ConfigFactoryImpl'
import {ConfigRepository} from '../interfaces/repositories'

describe('QueryConfigUseCaseImpl', () => {
  describe('execute', () => {
    it('will get configuration', async () => {
      const configFactory = new ConfigFactoryImpl()
      const config = configFactory.createFromJson({
        downloadFolderPath: 'downloadFolderPath',
        comicInfoDatabasePath: 'comicInfoDatabasePath',
      })

      const configRepository: ConfigRepository = {
        asyncSaveOrUpdate: jest.fn(),
        asyncGet: jest.fn(() => Promise.resolve(config)),
      }
      const uc = new QueryConfigUseCaseImpl(configRepository)
      const res = await uc.execute().toPromise()
      expect(configRepository.asyncGet).toBeCalled()

      expect(res instanceof Response).toBeTruthy()
      expect((res as Response).data).toEqual(config.serialize())
    })
  })
})
