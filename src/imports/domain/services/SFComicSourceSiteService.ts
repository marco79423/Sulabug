import {inject, injectable} from 'inversify'

import {IComicSourceFactory, IComicSourceSiteService, INetService} from '../interfaces'
import types from '../types'
import ComicSource from '../entities/ComicSource'


@injectable()
export default class SFComicSourceSiteService implements IComicSourceSiteService {
  private readonly _comicSourceFactory: IComicSourceFactory
  private readonly _netService: INetService

  public constructor(
    @inject(types.ComicSourceFactory) comicSourceFactory: IComicSourceFactory,
    @inject(types.NetService) netService: INetService,
  ) {
    this._comicSourceFactory = comicSourceFactory
    this._netService = netService
  }

  async asyncGetAllComicSources(): Promise<ComicSource[]> {
    const comicListPageUrls = await this._asyncGetAllComicListPageUrls()

    let allComicSource: ComicSource[] = []
    for (const comicListPageUrl of comicListPageUrls) {
      const comicSources = await this._asyncQueryComicSourcesFromComicListPage(comicListPageUrl)
      allComicSource = allComicSource.concat(comicSources)
    }
    return allComicSource
  }

  async asyncGetAllChaptersByComicPageUrl(pageUrl: string): Promise<{
    name: string,
    pageUrl: string,
  }[]> {
    const text = await this._netService.asyncGetText(pageUrl)
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')

    const chapters: { name: string, pageUrl: string }[] = []
    const nodes = dom.querySelectorAll('.comic_Serial_list > a')
    for (const node of nodes) {
      chapters.push({
        // @ts-ignore
        name: node.innerText,
        // @ts-ignore
        pageUrl: 'https://manhua.sfacg.com' + node.pathname,
      })
    }

    return chapters
  }

  async asyncGetAllImagesFromChapterPageUrl(pageUrl: string): Promise<{
    name: string,
    imageUrl: string,
  }[]> {
    const parser = new DOMParser()
    const dom = parser.parseFromString(await this._netService.asyncGetText(pageUrl), 'text/html')

    // @ts-ignore
    const url = dom.querySelector('head > script:nth-child(7)').src

    const text = await this._netService.asyncGetText(url)

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

  private _asyncGetAllComicListPageUrls = async () => {
    const url = `https://manhua.sfacg.com/catalog/default.aspx`

    const parser = new DOMParser()
    const dom = parser.parseFromString(await this._netService.asyncGetText(url), 'text/html')

    // @ts-ignore
    const lastPageIndex = +dom.querySelector('.pagebarNext').previousSibling.innerText + 1

    const comicListPageUrls: string[] = []
    for (let pageIndex = 1; pageIndex <= lastPageIndex; pageIndex++) {
      comicListPageUrls.push(`https://manhua.sfacg.com/catalog/default.aspx?PageIndex=${pageIndex}`)

      break // TODO
    }

    return comicListPageUrls
  }

  private _asyncQueryComicSourcesFromComicListPage = async (comicListPageUrl) => {
    const comicSources: ComicSource[] = []
    const text = await this._netService.asyncGetText(comicListPageUrl)
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')
    const nodes = dom.querySelectorAll('.Comic_Pic_List>li:nth-child(2)>strong>a')
    for (const node of nodes) {
      // @ts-ignore
      const name = node.text

      // @ts-ignore
      const pageUrl = node.href

      const text = await this._netService.asyncGetText(pageUrl)
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

      console.log(name, pageUrl, catalog, author, lastUpdatedChapter, lastUpdatedTime, summary, chapters)

      comicSources.push(this._comicSourceFactory.createFromJson({
        id: name,
        name: name,
        coverDataUrl: `data:${coverImageType};base64,${coverBase64Content}`,
        source: 'SF',
        pageUrl: pageUrl,
        catalog: catalog,
        author: author,
        lastUpdatedChapter: lastUpdatedChapter,
        lastUpdatedTime: lastUpdatedTime.toISOString(),
        summary: summary,
        chapters: chapters,
      }))
    }

    return comicSources
  }

  private _guessMediaTypeByUrl(url: string): string {
    if (url.endsWith('.png')) {
      return 'image/png'
    } else {
      return 'image/jpeg'
    }
  }
}
