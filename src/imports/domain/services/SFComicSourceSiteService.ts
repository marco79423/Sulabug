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

    const text = await this._netService.asyncGetText(comicListPageUrl)
    const parser = new DOMParser()
    const dom = parser.parseFromString(text, 'text/html')
    const nodes = dom.querySelectorAll('.Comic_Pic_List>li:nth-child(2)>strong>a')

    const comicSources: ComicSource[] = []
    for (const node of nodes) {
      // @ts-ignore
      const name = node.text

      // @ts-ignore
      const pageUrl = node.href

      comicSources.push(this._comicSourceFactory.createFromJson({
        id: name,
        name: name,
        source: 'SF',
        pageUrl: pageUrl,
      }))
    }

    return comicSources
  }
}
