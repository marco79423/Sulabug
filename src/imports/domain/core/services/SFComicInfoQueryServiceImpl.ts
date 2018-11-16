import * as cheerio from 'cheerio'
import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {ComicInfoFactory} from '../interfaces/factories'
import ComicInfo from '../entities/ComicInfo'
import {SFComicInfoQueryService} from '../interfaces/services'
import {NetAdapter} from '../interfaces/adapters'

@injectable()
export default class SFComicInfoQueryServiceImpl implements SFComicInfoQueryService {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _netAdapter: NetAdapter

  public constructor(
    @inject(coreTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(coreTypes.NetAdapter) netAdapter: NetAdapter,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._netAdapter = netAdapter
  }

  asyncQuery = async () => {
    const comicListPageUrls = await this._asyncGetAllComicListPageUrls()

    let allComicInfos: ComicInfo[] = []
    for (const comicListPageUrl of comicListPageUrls) {
      const comicInfos = await this._asyncGetComicInfosFromComicListPage(comicListPageUrl)
      allComicInfos = allComicInfos.concat(comicInfos)
    }
    return allComicInfos
  }

  private _asyncGetAllComicListPageUrls = async () => {
    const url = `https://manhua.sfacg.com/catalog/default.aspx`

    const text = await this._netAdapter.asyncGetText(url)
    const $ = cheerio.load(text)
    const lastPageIndex = +$('a', $('.pagebarNext').prev()).text() + 1

    const comicListPageUrls: string[] = []
    for (let pageIndex = 1; pageIndex <= lastPageIndex; pageIndex++) {
      comicListPageUrls.push(`https://manhua.sfacg.com/catalog/default.aspx?PageIndex=${pageIndex}`)
    }

    return comicListPageUrls
  }

  private _asyncGetComicInfosFromComicListPage = async (comicListPageUrl) => {
    const text = await this._netAdapter.asyncGetText(comicListPageUrl)
    const $ = cheerio.load(text)

    const elements = $('.Comic_Pic_List').map((index, element) => element).get()

    const comicInfos: ComicInfo[] = []
    for (const element of elements) {
      const coverImageUrl = 'https:' + $('li:nth-child(1) a img', element).attr('src')
      const name = $('li:nth-child(2) strong a', element).text()
      const pageUrl = 'https:' + $('li:nth-child(2) strong a', element).attr('href')
      const author = $('li:nth-child(2) :nth-child(3)', element).text()
      const catalog = $('li:nth-child(2) :nth-child(6)', element).text()

      // https://stackoverflow.com/questions/6925088/get-the-text-after-span-element-using-jquery
      const lastUpdated = $('li:nth-child(2)', element).contents()
        .filter((i, el) => {
          return el.type == 'text'
        })
        .eq(3)
        .text()
        .split('/')[1]
        .trim()

      const summary = $('li:nth-child(2)', element).contents()
        .filter((i, el) => el.type == 'text')
        .last()
        .text()
        .trim()

      comicInfos.push(this._comicInfoFactory.createFromJson({
        id: name,
        name: name,
        coverImage: {
          id: name,
          comicInfoId: name,
          mediaType: this._guessMediaTypeByUrl(coverImageUrl),
          base64Content: await this._netAdapter.asyncGetBinaryBase64(coverImageUrl)
        },
        source: 'SF',
        pageUrl: pageUrl,
        catalog: catalog,
        author: author,
        lastUpdated: lastUpdated,
        summary: summary,
      }))
    }

    return comicInfos
  }

  private _guessMediaTypeByUrl(url: string): string {
    if (url.endsWith('.png')) {
      return 'image/png'
    } else {
      return 'image/jpeg'
    }
  }
}
