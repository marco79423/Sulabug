import ComicInfo from '../entities/ComicInfo'
import Config from '../entities/Config'
import CoverImage from '../entities/CoverImage'
import DownloadTask from '../entities/DownloadTask'

export interface ComicInfoFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverImage: {
      id: string,
      comicInfoId: string,
      mediaType: string,
      base64Content: string,
    },
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
    comicsFolder: string,
    comicInfoStorePath: string,
  }): Config
}

export interface CoverImageFactory {
  createFromJson(json: {
    id: string,
    comicInfoId: string,
    mediaType: string,
    base64Content: string,
  }): CoverImage
}

export interface DownloadTaskFactory {
  createFromJson(json: {
    id: string,
    comicInfoId: string,
  }): DownloadTask
}
