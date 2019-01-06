import {inject, injectable} from 'inversify'

import path from 'path'
import Config from '../../../../domain/general/entities/Config'
import generalTypes from '../../../../domain/general/generalTypes'
import {ConfigFactory} from '../../../../domain/general/interfaces/factories'
import {ConfigRepository} from '../../../../domain/general/interfaces/repositories'
import infraTypes from '../../../infraTypes'
import Database from '../../../shared/interfaces/Database'
import {ConfigCollection} from '../../../shared/database/collections'

@injectable()
export default class ConfigRepositoryImpl implements ConfigRepository {
  defaultConfigData = {
    downloadFolderPath: path.resolve('./comics'),
    comicInfoDatabasePath: path.resolve('./comicInfoStore.json')
  }
  private readonly _configFactory: ConfigFactory
  private readonly _database: Database

  public constructor(
    @inject(generalTypes.ConfigFactory) configFactory: ConfigFactory,
    @inject(infraTypes.Database) database: Database,
  ) {
    this._configFactory = configFactory
    this._database = database
  }

  asyncSaveOrUpdate = async (config: Config): Promise<void> => {
    await this._database.asyncSaveOrUpdate(ConfigCollection.name, {
      id: 'default',
      ...config.serialize(),
    })
  }

  asyncGet = async (): Promise<Config> => {
    const config = await this._database.asyncFindOne(ConfigCollection.name)
    if (!config) {
      await this.asyncSaveOrUpdate(this._configFactory.createFromJson(this.defaultConfigData))
    }
    const rawConfig = await this._database.asyncFindOne(ConfigCollection.name)
    return this._configFactory.createFromJson(rawConfig)
  }
}
