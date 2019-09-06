import {inject, injectable} from 'inversify'

import {IComicSourceFactory, IComicSourceSiteService, INetAdapter} from '../interfaces'
import types from '../types'
import ComicSource from '../entities/ComicSource'


@injectable()
export default class SFComicSourceSiteService implements IComicSourceSiteService {
  private readonly _comicSourceFactory: IComicSourceFactory
  private readonly _netAdapter: INetAdapter

  public constructor(
    @inject(types.ComicSourceFactory) comicSourceFactory: IComicSourceFactory,
    @inject(types.NetAdapter) netAdapter: INetAdapter,
  ) {
    this._comicSourceFactory = comicSourceFactory
    this._netAdapter = netAdapter
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

  private _asyncGetAllComicListPageUrls = async () => {
    const url = `https://manhua.sfacg.com/catalog/default.aspx`

    const parser = new DOMParser()
    const dom = parser.parseFromString(await this._netAdapter.asyncGetText(url), 'text/html')

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

    const text = await this._netAdapter.asyncGetText(comicListPageUrl)
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
