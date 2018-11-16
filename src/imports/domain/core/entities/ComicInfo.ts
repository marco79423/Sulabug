import {Entity} from '../../base-types'
import CoverImage from './CoverImage'

export default class ComicInfo extends Entity {
  readonly name: string
  readonly coverImage: CoverImage
  readonly source: string
  readonly pageUrl: string
  readonly catalog: string
  readonly author: string
  readonly lastUpdated: string
  readonly summary: string

  constructor(
    identity: string,
    name: string,
    coverImage: CoverImage,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdated: string,
    summary: string,
  ) {
    super(identity)
    this.name = name
    this.coverImage = coverImage
    this.source = source
    this.pageUrl = pageUrl
    this.catalog = catalog
    this.author = author
    this.lastUpdated = lastUpdated
    this.summary = summary
  }

  serialize() {
    return {
      id: this.identity,
      name: this.name,
      coverImage: this.coverImage.serialize(),
      source: this.source,
      pageUrl: this.pageUrl,
      catalog: this.catalog,
      author: this.author,
      lastUpdated: this.lastUpdated,
      summary: this.summary,
    }
  }
}
