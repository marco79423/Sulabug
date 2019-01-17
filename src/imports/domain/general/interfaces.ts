import Config from './entities/Config'

export interface IConfigFactory {
  createFromJson(json: {
    downloadFolderPath: string,
  }): Config
}

export interface IConfigRepository {

  asyncSaveOrUpdate(config: Config): Promise<void>

  asyncGet(): Promise<Config>
}
