import {inject, injectable} from 'inversify'
import path from 'path'

import Config from '../../../../../domain/general/entities/Config'
import generalTypes from '../../../../../domain/general/generalTypes'
import {ConfigFactory} from '../../../../../domain/general/interfaces/factories'
import {ConfigRepository} from '../../../../../domain/general/interfaces/repositories'
import {FileHandler} from '../../../interfaces/bases'
import coreTypes from '../../../coreTypes'

@injectable()
export default class ConfigRepositoryImpl implements ConfigRepository {
  configPath = './config.json'
  defaultConfigData = {
    downloadFolderPath: path.resolve('./comics'),
    comicInfoDatabasePath: path.resolve('./comicInfoStore.json')
  }
  private readonly _configFactory: ConfigFactory
  private readonly _fileHandler: FileHandler

  public constructor(
    @inject(generalTypes.ConfigFactory) configFactory: ConfigFactory,
    @inject(coreTypes.FileHandler) fileHandler: FileHandler,
  ) {
    this._configFactory = configFactory
    this._fileHandler = fileHandler
  }

  asyncSaveOrUpdate = async (config: Config): Promise<void> => {
    await this._fileHandler.asyncWriteJson(this.configPath, config.serialize())
  }

  asyncGet = async (): Promise<Config> => {
    const exists = await this._fileHandler.asyncPathExists(this.configPath)
    if (!exists) {
      await this.asyncSaveOrUpdate(this._configFactory.createFromJson(this.defaultConfigData))
    }
    const rawConfig = await this._fileHandler.asyncReadJson(this.configPath, this.defaultConfigData)
    return this._configFactory.createFromJson({
      ...this.defaultConfigData,
      ...rawConfig,
    })
  }
}
