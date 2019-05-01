import 'reflect-metadata'

import {inject, injectable} from 'inversify'
import ComicInfo from '../entities/ComicInfo'
import Chapter from '../entities/Chapter'
import {IComicInfoFactory, IComicSourceFactory} from '../interfaces'
import types from '../types'


@injectable()
export default class ComicInfoFactory implements IComicInfoFactory {
  private readonly _comicSourceFactory: IComicSourceFactory

  public constructor(
    @inject(types.ComicSourceFactory) comicSourceFactory: IComicSourceFactory,
  ) {
    this._comicSourceFactory = comicSourceFactory
  }

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
      this._comicSourceFactory,
    )
  }
}


