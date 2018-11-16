import * as fs from 'fs-extra'
import path from 'path'
import {inject, injectable} from 'inversify'
import Config from '../../../domain/core/entities/Config'
import coreTypes from '../../../domain/core/coreTypes'
import {ConfigFactory} from '../../../domain/core/interfaces/factories'
import {ConfigRepository} from '../../../domain/core/interfaces/repositories'

@injectable()
export default class ConfigRepositoryImpl implements ConfigRepository {
  private readonly _configFactory: ConfigFactory

  configPath = './config.json'

  defaultConfigData = {
    comicsFolder: path.resolve('./comics'),
    comicInfoStorePath: path.resolve('./comicInfoStore.json')
  }

  public constructor(
    @inject(coreTypes.ConfigFactory) configFactory: ConfigFactory,
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
