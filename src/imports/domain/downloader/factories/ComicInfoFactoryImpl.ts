import 'reflect-metadata'

import {inject, injectable} from 'inversify'

import coreTypes from '../downloaderTypes'
import {ComicInfoFactory, CoverImageFactory} from '../interfaces/factories'
import ComicInfo from '../entities/ComicInfo'

@injectable()
export default class ComicInfoFactoryImpl implements ComicInfoFactory {
  private readonly _coverImageFactory: CoverImageFactory

  constructor(
    @inject(coreTypes.CoverImageFactory) coverImageFactory: CoverImageFactory,
  ) {
    this._coverImageFactory = coverImageFactory
  }

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
  }): ComicInfo {
    return new ComicInfo(
      json.id,
      json.name,
      this._coverImageFactory.createFromJson(json.coverImage),
      json.source,
      json.pageUrl,
      json.catalog,
      json.author,
      json.lastUpdated,
      json.summary,
    )
  }
}


