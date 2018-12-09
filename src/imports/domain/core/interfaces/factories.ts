import ComicInfo from '../entities/ComicInfo'
import Config from '../entities/Config'

export interface ComicInfoFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdated: string,
    summary: string,
  }): ComicInfo
}

export interface ConfigFactory {
  createFromJson(json: {
    downloadFolderPath: string,
    comicInfoDatabasePath: string,
  }): Config
}
