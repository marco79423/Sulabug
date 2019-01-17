import {inject, injectable} from 'inversify'
import Config from '../../../../domain/general/entities/Config'
import generalTypes from '../../../../domain/general/generalTypes'
import {IConfigFactory} from '../../../../domain/general/interfaces'
import {IConfigRepository} from '../../../../domain/general/interfaces'
import infraTypes from '../../../infraTypes'
import Database from '../../../shared/interfaces/Database'
import {ConfigCollection} from '../../../shared/database/collections'

@injectable()
export default class ConfigRepositoryImpl implements IConfigRepository {
  defaultRawConfig = {
    downloadFolderPath: './comics',
  }
  private readonly _configFactory: IConfigFactory
  private readonly _database: Database

  public constructor(
    @inject(generalTypes.ConfigFactory) configFactory: IConfigFactory,
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
    let rawConfig = await this._database.asyncFindOne(ConfigCollection.name)
    if (!rawConfig) {
      await this._database.asyncSaveOrUpdate(ConfigCollection.name, {
        id: 'default',
        ...this.defaultRawConfig,
      })
      rawConfig = this.defaultRawConfig
    }
    return this._configFactory.createFromJson(rawConfig)
  }
}
