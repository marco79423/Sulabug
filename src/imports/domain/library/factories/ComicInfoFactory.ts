import 'reflect-metadata'

import {injectable} from 'inversify'
import {IComicInfoFactory} from '../interfaces'
import ComicInfo from '../entities/ComicInfo'

@injectable()
export default class ComicInfoFactory implements IComicInfoFactory {

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
  }): ComicInfo {
    return new ComicInfo(
      json.id,
      json.name,
      json.coverDataUrl,
      json.source,
      json.pageUrl,
      json.catalog,
      json.author,
      json.lastUpdated,
      json.summary,
    )
  }
}


