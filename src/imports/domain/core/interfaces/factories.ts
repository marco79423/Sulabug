import Config from '../entities/Config'

export interface ConfigFactory {
  createFromJson(json: {
    downloadFolderPath: string,
    comicInfoDatabasePath: string,
  }): Config
}
