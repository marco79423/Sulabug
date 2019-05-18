import 'reflect-metadata'

import {inject, injectable} from 'inversify'
import Comic from '../entities/Comic'
import Chapter from '../entities/Chapter'
import {IComicFactory, IComicSourceFactory} from '../interfaces'
import types from '../types'


@injectable()
export default class ComicFactory implements IComicFactory {
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
    inCollection: boolean,
  }): Comic {
    return new Comic(
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
      json.inCollection,
      this._comicSourceFactory,
    )
  }
}


