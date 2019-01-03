import {inject, injectable} from 'inversify'
import * as cheerio from 'cheerio'

import {SFSourceSite} from '../interfaces/source-sites'
import {NetHandler} from '../../vendor/interfaces/handlers'
import coreTypes from '../coreTypes'

@injectable()
export class SFSourceSiteImpl implements SFSourceSite {
  private readonly _netHandler: NetHandler

  public constructor(
    @inject(coreTypes.NetHandler) netHandler: NetHandler,
  ) {
    this._netHandler = netHandler
  }

  async asyncGetComicInfos(): Promise<{
    name: string,
    coverDataUrl: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdated: string,
    summary: string,
  }[]> {
    const comicListPageUrls = await this._asyncGetAllComicListPageUrls()

    let allComicInfos: {
      name: string,
      coverDataUrl: string,
      pageUrl: string,
      catalog: string,
      author: string,
      lastUpdated: string,
      summary: string,
    }[] = []
    for (const comicListPageUrl of comicListPageUrls) {
      const comicInfos = await this._asyncGetComicInfosFromComicListPage(comicListPageUrl)
      allComicInfos = allComicInfos.concat(comicInfos)
    }
    return allComicInfos
  }

  async asyncGetAllChaptersByComicPageUrl(pageUrl: string): Promise<{
    name: string,
    pageUrl: string,
  }[]> {
    const $ = await this._asyncGetSelector(pageUrl)
    const chapters: { name: string, pageUrl: string }[] = []
    $('.comic_Serial_list a').each((index, element) => {
      chapters.push({
        name: $(element).text(),
        pageUrl: 'https://manhua.sfacg.com' + $(element).attr('href'),
      })
    })
    return chapters
  }

  async asyncGetAllImagesFromChapterPageUrl(pageUrl: string): Promise<{
    name: string,
    imageUrl: string,
  }[]> {
    const $ = await this._asyncGetSelector(pageUrl)

    const url = 'https:' + $('head script')
      .filter((index, element) => $(element).attr('src').includes('//comic.sfacg.com/Utility/'))
      .first()
      .attr('src')

    const text = await this._netHandler.asyncGetText(url)

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

  private async _asyncGetSelector(targetUrl: string) {
    const text = await this._netHandler.asyncGetText(targetUrl)
    return cheerio.load(text)
  }

  private _asyncGetAllComicListPageUrls = async () => {
    const url = `https://manhua.sfacg.com/catalog/default.aspx`

    const $ = await this._asyncGetSelector(url)
    const lastPageIndex = +$('a', $('.pagebarNext').prev()).text() + 1

    const comicListPageUrls: string[] = []
    for (let pageIndex = 1; pageIndex <= lastPageIndex; pageIndex++) {
      comicListPageUrls.push(`https://manhua.sfacg.com/catalog/default.aspx?PageIndex=${pageIndex}`)
    }

    return comicListPageUrls
  }

  private _asyncGetComicInfosFromComicListPage = async (comicListPageUrl) => {
    const $ = await this._asyncGetSelector(comicListPageUrl)

    const elements = $('.Comic_Pic_List').map((index, element) => element).get()

    const comicInfos: {
      name: string,
      coverDataUrl: string,
      pageUrl: string,
      catalog: string,
      author: string,
      lastUpdated: string,
      summary: string,
    }[] = []
    
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

      const coverImageType = this._guessMediaTypeByUrl(coverImageUrl)
      const coverBase64Content = await this._netHandler.asyncGetBinaryBase64(coverImageUrl)

      comicInfos.push({
        name,
        coverDataUrl: `data:${coverImageType};base64,${coverBase64Content}`,
        pageUrl,
        catalog,
        author,
        lastUpdated,
        summary,
      })
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
