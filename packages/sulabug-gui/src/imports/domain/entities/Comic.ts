import {Entity} from '../base-types'
import Chapter from './Chapter'
import ComicSource from './ComicSource'
import {IComicSourceFactory} from '../interfaces'

export default class Comic extends Entity {
  readonly name: string
  readonly coverDataUrl: string
  readonly source: string
  readonly pageUrl: string
  readonly catalog: string
  readonly author: string
  readonly lastUpdatedChapter: string
  readonly lastUpdatedTime: Date
  readonly summary: string
  readonly chapters: Chapter[]
  inCollection: boolean

  readonly _comicSourceFactory: IComicSourceFactory

  constructor(
    id: string,
    name: string,
    coverDataUrl: string,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdatedChapter: string,
    lastUpdatedTime: Date,
    summary: string,
    chapters: Chapter[],
    inCollection: boolean,
    comicSourceFactory: IComicSourceFactory
  ) {
    super(id)
    this.name = name
    this.coverDataUrl = coverDataUrl
    this.source = source
    this.pageUrl = pageUrl
    this.catalog = catalog
    this.author = author
    this.lastUpdatedChapter = lastUpdatedChapter
    this.lastUpdatedTime = lastUpdatedTime
    this.summary = summary
    this.chapters = chapters
    this.inCollection = inCollection

    this._comicSourceFactory = comicSourceFactory
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      coverDataUrl: this.coverDataUrl,
      source: this.source,
      pageUrl: this.pageUrl,
      catalog: this.catalog,
      author: this.author,
      lastUpdatedChapter: this.lastUpdatedChapter,
      lastUpdatedTime: this.lastUpdatedTime.toISOString(),
      summary: this.summary,
      chapters: this.chapters.map(chapter => chapter.serialize()),
      inCollection: this.inCollection,
    }
  }

  getAvailableSource(): ComicSource {
    return this._comicSourceFactory.createFromJson({
      id: this.id,
      name: this.name,
      source: this.source,
      pageUrl: this.pageUrl,
    })
  }
}
