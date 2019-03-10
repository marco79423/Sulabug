import {inject, injectable} from 'inversify'

import {ISFSourceSite} from '../interfaces'
import generalTypes from '../../../domain/general/generalTypes'
import {INetService} from '../../../domain/general/interfaces'

@injectable()
export default class SFSourceSite implements ISFSourceSite {
  private readonly _netService: INetService

  public constructor(
    @inject(generalTypes.NetService) netService: INetService,
  ) {
    this._netService = netService
  }

  async asyncQueryComicInfos(): Promise<{
    name: string,
    coverDataUrl: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdatedChapter: string,
    lastUpdatedTime: Date,
    summary: string,
  }[]> {
    const comicListPageUrls = await this._asyncGetAllComicListPageUrls()

    let allComicInfos: {
      name: string,
      coverDataUrl: string,
      pageUrl: string,
      catalog: string,
      author: string,
      lastUpdatedChapter: string,
      lastUpdatedTime: Date,
      summary: string,
    }[] = []
    for (const comicListPageUrl of comicListPageUrls) {
      const comicInfos = await this._asyncQueryComicInfosFromComicListPage(comicListPageUrl)
      allComicInfos = allComicInfos.concat(comicInfos)
    }
    return allComicInfos
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
    }

    return comicListPageUrls
  }

  private _asyncQueryComicInfosFromComicListPage = async (comicListPageUrl) => {
    const comicInfos: {
      name: string,
      coverDataUrl: string,
      pageUrl: string,
      catalog: string,
      author: string,
      lastUpdatedChapter: string,
      lastUpdatedTime: Date,
      summary: string,
    }[] = []
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

      console.log(name, pageUrl, catalog, author, lastUpdatedChapter, lastUpdatedTime, summary)
      comicInfos.push({
        name,
        coverDataUrl: `data:${coverImageType};base64,${coverBase64Content}`,
        pageUrl,
        catalog,
        author,
        lastUpdatedChapter,
        lastUpdatedTime,
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
