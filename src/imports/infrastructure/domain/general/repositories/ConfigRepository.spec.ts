import 'reflect-metadata'

import Config from '../../../../domain/general/entities/Config'
import IDatabase from '../../../shared/interfaces'
import {ConfigCollection} from '../../../shared/database/collections'
import ConfigFactory from '../../../../domain/general/factories/ConfigFactory'
import ConfigRepository from './ConfigRepository'


describe('ConfigRepository', () => {
  describe('asyncSaveOrUpdate', () => {
    it('will save or update the target config into repository', async () => {

      const config = new Config(
        'comicsFolder'
      )

      const configFactory = new ConfigFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(),
      }

      const configRepository = new ConfigRepository(
        configFactory,
        database
      )

      await configRepository.asyncSaveOrUpdate(config)

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

      const configFactory = new ConfigFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => config.serialize()),
      }

      const configRepository = new ConfigRepository(
        configFactory,
        database
      )

      const result = await configRepository.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(ConfigCollection.name)
      expect(result.serialize()).toEqual(config.serialize())
    })

    it('will insert default config before get config from repository', async () => {
      const configFactory = new ConfigFactory()

      const database: IDatabase = {
        asyncSaveOrUpdate: jest.fn(),
        asyncFind: jest.fn(),
        asyncFindOne: jest.fn(() => null),
      }

      const configRepository = new ConfigRepository(
        configFactory,
        database
      )

      const result = await configRepository.asyncGet()

      expect(database.asyncFindOne).toBeCalledWith(ConfigCollection.name)
      expect(database.asyncSaveOrUpdate).toBeCalledWith(ConfigCollection.name, {
        id: 'default',
        ...configRepository.defaultRawConfig,
      })

      expect(result.serialize()).toEqual(configRepository.defaultRawConfig)
    })
  })
})

