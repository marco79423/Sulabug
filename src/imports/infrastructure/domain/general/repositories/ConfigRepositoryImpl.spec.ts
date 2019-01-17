import 'reflect-metadata'

import Config from '../../../../domain/general/entities/Config'
import IDatabase from '../../../shared/interfaces'
import {ConfigCollection} from '../../../shared/database/collections'
import ConfigFactoryImpl from '../../../../domain/general/factories/ConfigFactoryImpl'
import ConfigRepositoryImpl from './ConfigRepositoryImpl'


describe('ConfigRepositoryImpl', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target config into repository', async () => {

      const config = new Config(
        'comicsFolder'
      )

      const configFactory = new ConfigFactoryImpl()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const configRepositoryImpl = new ConfigRepositoryImpl(
        configFactory,
        database
      )

      await configRepositoryImpl.asyncSaveOrUpdate(config)

      expect(database.asyncSaveOrUpdate).toBeCalledWith(ConfigCollection.name, {
        id: 'default',
        ...config.serialize(),
      })
    })
  })

  describe('asyncGet', () => {
    it('will get config from repository', async () => {

      const config = new Config(
        'comicsFolder'
      )

      const configFactory = new ConfigFactoryImpl()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => config.serialize()),
      }

      const configRepositoryImpl = new ConfigRepositoryImpl(
        configFactory,
        database
      )

      const result = await configRepositoryImpl.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(ConfigCollection.name)
      expect(result.serialize()).toEqual(config.serialize())
    })

    it('will insert default config before get config from repository', async () => {
      const configFactory = new ConfigFactoryImpl()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const configRepositoryImpl = new ConfigRepositoryImpl(
        configFactory,
        database
      )

      const result = await configRepositoryImpl.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(ConfigCollection.name)
      expect(database.asyncSaveOrUpdate).toBeCalledWith(ConfigCollection.name, {
        id: 'default',
        ...configRepositoryImpl.defaultRawConfig,
      })

      expect(result.serialize()).toEqual(configRepositoryImpl.defaultRawConfig)
    })
  })
})

