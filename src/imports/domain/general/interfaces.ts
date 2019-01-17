import Config from './entities/Config'

export interface ConfigFactory {
  createFromJson(json: {
    downloadFolderPath: string,
  }): Config
}

export interface ConfigRepository {

  asyncSaveOrUpdate(config: Config): Promise<void>

  asyncGet(): Promise<Config>
}
