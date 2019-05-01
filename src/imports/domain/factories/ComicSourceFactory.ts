import 'reflect-metadata'

import {injectable} from 'inversify'
import ComicInfo from '../entities/ComicInfo'
import Chapter from '../entities/Chapter'
import {IComicSourceFactory} from '../interfaces'


@injectable()
export default class ComicSourceFactory implements IComicSourceFactory {

  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdatedChapter: string,
    lastUpdatedTime: string,
    summary: string,
    chapters: {
      id: string
      order: number
      name: string
      sourcePageUrl: string
    }[],
  }): ComicInfo {
    return new ComicInfo(
      json.id,
      json.name,
      json.coverDataUrl,
      json.source,
      json.pageUrl,
      json.catalog,
      json.author,
      json.lastUpdatedChapter,
      new Date(json.lastUpdatedTime),
      json.summary,
      json.chapters.map(rawChapter => new Chapter(
        rawChapter.id,
        rawChapter.order,
        rawChapter.name,
        rawChapter.sourcePageUrl,
      )),
    )
  }
}

