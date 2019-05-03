import {Entity} from '../base-types'
import Chapter from './Chapter'
import {IFileAdapter, INetAdapter} from '../interfaces'
import * as path from "path"

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

  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter

  constructor(
    id: string,
    name: string,
    source: string,
    pageUrl: string,
    netAdapter: INetAdapter,
    fileAdapter: IFileAdapter,
  ) {
    super(id)
    this.name = name
    this.source = source
    this.pageUrl = pageUrl
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      source: this.source,
      pageUrl: this.pageUrl,
    }
  }

  async asyncGetCoverDataUrl(): Promise<string> {
    if (!this._coverDataUrl) {
      await this._asyncGetInfoFromSource()
    }
    return this._coverDataUrl
  }

  async asyncGetCatalog(): Promise<string> {
    if (!this._catalog) {
      await this._asyncGetInfoFromSource()
    }
    return this._catalog
  }

  async asyncGetAuthor(): Promise<string> {
    if (!this._author) {
      await this._asyncGetInfoFromSource()
    }
    return this._author
  }

  async asyncGetLastUpdatedChapter(): Promise<string> {
    if (!this._lastUpdatedChapter) {
      await this._asyncGetInfoFromSource()
    }
    return this._lastUpdatedChapter
  }

  async asyncGetLastUpdatedTime(): Promise<Date> {
    if (!this._lastUpdatedTime) {
      await this._asyncGetInfoFromSource()
    }
    return this._lastUpdatedTime as Date
  }

  async asyncGetSummary(): Promise<string> {
    if (!this._summary) {
      await this._asyncGetInfoFromSource()
    }
    return this._summary
  }

  async asyncGetChapters(): Promise<Chapter[]> {
    if (this._chapters.length === 0) {
      await this._asyncGetInfoFromSource()
    }
    return this._chapters
  }

  async asyncDownload(downloadFolderPath: string, progressCallback): Promise<void> {
    const chapters = await this.asyncGetChapters()
    let totalProgress = 0.0
    const progressUnit = Math.floor(100 / (chapters.length + 1))

    const targetComicFolderPath = path.join(downloadFolderPath, this.name)

    await this._fileAdapter.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: this.id})

    totalProgress += progressUnit
    progressCallback(totalProgress, false)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      const targetComicChapterFolderPath = path.join(targetComicFolderPath, chapter.name)
      await this._asyncDownloadChapter(chapter.sourcePageUrl, targetComicChapterFolderPath)
      totalProgress += progressUnit
      progressCallback(totalProgress, false)
    }
    progressCallback(100, true)
  }

  private async _asyncDownloadChapter(pageUrl: string, targetDir: string): Promise<void> {
    if (await this._fileAdapter.asyncPathExists(path.join(targetDir, '.done'))) {
      return
    }

    await this._fileAdapter.asyncEnsureDir(targetDir)
    const images = await this._asyncGetAllImagesFromChapterPageUrl(pageUrl)
    for (const image of images) {
      const imagePath = path.join(targetDir, image.name)
      await this._netAdapter.asyncDownload(image.imageUrl, imagePath)
    }

    await this._fileAdapter.asyncWriteJson(targetDir + '/.done', null)
  }

  private async _asyncGetAllImagesFromChapterPageUrl(pageUrl: string): Promise<{
    name: string,
    imageUrl: string,
  }[]> {
    const parser = new DOMParser()
    const dom = parser.parseFromString(await this._netAdapter.asyncGetText(pageUrl), 'text/html')

    // @ts-ignore
    const url = dom.querySelector('head > script:nth-child(7)').src

    const text = await this._netAdapter.asyncGetText(url)

    // @ts-ignore
    const host = /hosts = \["([^"]+)"/g.exec(text)[1]

    const images: { name: string, imageUrl: string }[] = []
    let matched
    const re = /picAy\[(\d+)\] = "([^"]+)"/g
    while ((matched = re.exec(text)) !== null) {
      images.push({
        name: `${+matched[1] + 1}`.padStart(3, '0') + '.jpg',
        imageUrl: host + matched[2]
      })
    }

    return images
  }

  private async _asyncGetInfoFromSource() {
    const text = await this._netAdapter.asyncGetText(this.pageUrl)
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
    const coverBase64Content = await this._netAdapter.asyncGetBinaryBase64(coverImageUrl)

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
