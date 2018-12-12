import {inject, injectable} from 'inversify'
import * as fs from 'fs-extra'
import path from 'path'

import Config from '../../../../../domain/general/entities/Config'
import generalTypes from '../../../../../domain/general/generalTypes'
import {ConfigFactory} from '../../../../../domain/general/interfaces/factories'
import {ConfigRepository} from '../../../../../domain/general/interfaces/repositories'

@injectable()
export default class ConfigRepositoryImpl implements ConfigRepository {
  configPath = './config.json'
  defaultConfigData = {
    downloadFolderPath: path.resolve('./comics'),
    comicInfoDatabasePath: path.resolve('./comicInfoStore.json')
  }
  private readonly _configFactory: ConfigFactory

  public constructor(
    @inject(generalTypes.ConfigFactory) configFactory: ConfigFactory,
  ) {
    this._configFactory = configFactory
  }

  async asyncSaveOrUpdate(config: Config): Promise<void> {
    await fs.writeJson(this.configPath, config.serialize())
  }

  async asyncGet(): Promise<Config> {
    const exists = await fs.pathExists(this.configPath)
    if (!exists) {
      await this.asyncSaveOrUpdate(this._configFactory.createFromJson(this.defaultConfigData))
    }
    const rawConfig = await fs.readJSON(this.configPath)
    return this._configFactory.createFromJson({
      ...this.defaultConfigData,
      ...rawConfig,
    })
  }
}
