import {Entity} from '../base-types'
import Chapter from './Chapter'
import {INetService} from '../interfaces'

export default class ComicSource extends Entity {
  readonly name: string
  readonly source: string
  readonly pageUrl: string
  private _coverDataUrl: string = ''
  private _catalog: string = ''
  private _author: string = ''
  private _lastUpdatedChapter: string = ''
  private _lastUpdatedTime: Date | null = null
  private _summary: string = ''
  private _chapters: Chapter[] = []
  private readonly _netService: INetService

  constructor(
    identity: string,
    name: string,
    source: string,
    pageUrl: string,
    netService: INetService,
  ) {
    super(identity)
    this.name = name
    this.source = source
    this.pageUrl = pageUrl
    this._netService = netService
  }

  serialize() {
    return {
      id: this.identity,
      name: this.name,
      source: this.source,
      pageUrl: this.pageUrl,
    }
  }

  async asyncGetCoverDataUrl(): Promise<string> {
    if(!this._coverDataUrl) {
      await this._asyncGetInfoFromSource()
    }
    return this._coverDataUrl
  }

  async asyncGetCatalog(): Promise<string> {
    if(!this._catalog) {
      await this._asyncGetInfoFromSource()
    }
    return this._catalog
  }

  async asyncGetAuthor(): Promise<string> {
    if(!this._author) {
      await this._asyncGetInfoFromSource()
    }
    return this._author
  }

  async asyncGetLastUpdatedChapter(): Promise<string> {
    if(!this._lastUpdatedChapter) {
      await this._asyncGetInfoFromSource()
    }
    return this._lastUpdatedChapter
  }

  async asyncGetLastUpdatedTime(): Promise<Date> {
    if(!this._lastUpdatedTime) {
      await this._asyncGetInfoFromSource()
    }
    return this._lastUpdatedTime as Date
  }

  async asyncGetSummary(): Promise<string> {
    if(!this._summary) {
      await this._asyncGetInfoFromSource()
    }
    return this._summary
  }

  async asyncGetChapters(): Promise<Chapter[]> {
    if(!this._chapters) {
      await this._asyncGetInfoFromSource()
    }
    return this._chapters
  }

  private async _asyncGetInfoFromSource() {
    const text = await this._netService.asyncGetText(this.pageUrl)
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')

    // @ts-ignore
    const coverImageUrl = dom.querySelector('body > div:nth-child(6) > div.plate_top > ul.synopsises_font > li.cover > img').src

    // @ts-ignore
    const catalog = dom.querySelector('ul.synopsises_font>li:nth-child(2)>a:nth-child(10)').textContent as string

    // @ts-ignore
    const author = dom.querySelector('ul.synopsises_font>li:nth-child(2)>a:nth-child(8)').textContent as string

    // @ts-ignore
    const lastUpdatedChapter = dom.querySelector('ul.synopsises_font>li:nth-child(2)>span:nth-child(13)').textContent as string

    // @ts-ignore
    const dateString = dom.querySelector('ul.synopsises_font>li:nth-child(2)>span:nth-child(16)').nextSibling.textContent.trim()
    const lastUpdatedTime = new Date(dateString)

    // @ts-ignore
    const summary = dom.querySelector('ul.synopsises_font>li:nth-child(2)>br').nextSibling.textContent.trim()

    const coverImageType = this._guessMediaTypeByUrl(coverImageUrl)
    const coverBase64Content = await this._netService.asyncGetBinaryBase64(coverImageUrl)

    const chapters: {
      id: string
      order: number
      name: string
      sourcePageUrl: string
    }[] = []
    const nodes = dom.querySelectorAll('.comic_Serial_list > a')
    for (const [index, node] of nodes.entries()) {
      chapters.push({
        // @ts-ignore
        id: `${name}-${node.innerText}`,
        order: nodes.length - index - 1,
        // @ts-ignore
        name: node.innerText,
        // @ts-ignore
        sourcePageUrl: 'https://manhua.sfacg.com' + node.pathname,
      })
    }

    console.log(name, catalog, author, lastUpdatedChapter, lastUpdatedTime, summary, chapters)

    this._coverDataUrl = `data:${coverImageType};base64,${coverBase64Content}`
    this._catalog = catalog
    this._author = author
    this._lastUpdatedChapter = lastUpdatedChapter
    this._lastUpdatedTime = lastUpdatedTime
    this._summary = summary
    this._chapters = chapters.map(rawChapter => new Chapter(
      rawChapter.id,
      rawChapter.order,
      rawChapter.name,
      rawChapter.sourcePageUrl,
    ))
  }

  private _guessMediaTypeByUrl(url: string): string {
    if (url.endsWith('.png')) {
      return 'image/png'
    } else {
      return 'image/jpeg'
    }
  }
}
