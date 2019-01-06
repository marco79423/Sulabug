import Config from '../entities/Config'

export interface ConfigFactory {
  createFromJson(json: {
    downloadFolderPath: string,
  }): Config
}
