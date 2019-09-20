import {
  ITaskStatus,
  IWebComic,
  IWebComicChapter,
  IWebComicImage,
  IWebComicSource,
  IWebComicBlueprint
} from '../interface'
import {Observable} from 'rxjs'
import {JSDOM} from 'jsdom'
import axios from 'axios'
import * as path from 'path'
import * as fs from 'fs-extra'

const sleep = (m: number) => new Promise(r => setTimeout(r, m))

async function fetchText(targetUrl: string): Promise<string> {
  try {
    const response = await axios.get(targetUrl, {
      responseType: 'document',
    })
    return await response.data
  } catch (e) {
    await sleep(5000)
    return await fetchText(targetUrl)
  }
}

async function downloadFile(targetUrl: string, targetPath: string) {
  try {
    const res = await axios.get(targetUrl, {responseType: 'stream'})
    await new Promise(resolve => {
      res.data.pipe(fs.createWriteStream(targetPath))
      res.data.on('end', () => {
        resolve()
      })
    })
  } catch (e) {
    await sleep(5000)
    await downloadFile(targetUrl, targetPath)
  }
}


export class SFWebComicSource implements IWebComicSource {
  public readonly code: string
  public readonly name: string

  constructor() {
    this.code = 'sfacg'
    this.name = 'SF互动传媒网'
  }

  public createWebComicByBlueprint(blueprint: IWebComicBlueprint): IWebComic {
    const {name, pageUrl} = blueprint
    return new SFWebComic(name, pageUrl)
  }

  collectAllWebComics(): Observable<ITaskStatus> {
    // @ts-ignore
    return new Observable(async subscriber => {
      const comicListPageHtml = await fetchText('https://manhua.sfacg.com/catalog/default.aspx')
      const {document} = new JSDOM(comicListPageHtml).window

      // @ts-ignore
      const lastPageIndex = +document.querySelector('.pagebarNext').previousSibling.textContent + 1
      const comicListPageUrls: string[] = []
      for (let pageIndex = 1; pageIndex <= lastPageIndex; pageIndex++) {
        comicListPageUrls.push(`https://manhua.sfacg.com/catalog/default.aspx?PageIndex=${pageIndex}`)
      }

      const webComics: SFWebComic[] = []

      for (const [index, comicListPageUrl] of comicListPageUrls.entries()) {
        const comicListPageHtml = await fetchText(comicListPageUrl)
        const {document} = new JSDOM(comicListPageHtml).window

        const nodes = document.querySelectorAll('.Comic_Pic_List>li:nth-child(2)>strong>a')

        // @ts-ignore
        for (const node of nodes) {
          // @ts-ignore
          const name = node.text

          // @ts-ignore
          const pageUrl = 'https:' + node.href

          webComics.push(new SFWebComic(name, pageUrl))
        }

        subscriber.next({
          result: webComics,
          completed: index === comicListPageUrls.length - 1,
          progress: {
            current: index + 1,
            total: comicListPageUrls.length,
            status: `更新了 ${nodes.length} 部漫畫`,
          }
        })
      }
    })
  }
}


export class SFWebComic implements IWebComic {
  public readonly source: string
  public readonly name: string
  public readonly sourcePageUrl: string
  public readonly blueprint: IWebComicBlueprint

  private _updated: boolean
  private _coverUrl: string
  private _author: string
  private _summary: string
  private _catalog: string
  private _lastUpdatedChapter: string
  private _lastUpdatedTime: Date
  private _chapters: SFWebComicChapter[]

  constructor(name: string, sourcePageUrl: string) {
    this.source = 'sfacg'
    this.name = name
    this.sourcePageUrl = sourcePageUrl

    this.blueprint = {
      name: this.name,
      sourcePageUrl: this.sourcePageUrl,
    }

    this._updated = false
  }

  public async updateInfo() {
    const {document} = new JSDOM(await fetchText(this.sourcePageUrl)).window

    // @ts-ignore
    this._coverUrl = document.querySelector('body > div:nth-child(6) > div.plate_top > ul.synopsises_font > li.cover > img').src

    // @ts-ignore
    this._catalog = document.querySelector('ul.synopsises_font>li:nth-child(2)>a:nth-child(10)').textContent as string

    // @ts-ignore
    this._author = document.querySelector('ul.synopsises_font>li:nth-child(2)>a:nth-child(8)').textContent as string

    // @ts-ignore
    this._summary = document.querySelector('ul.synopsises_font>li:nth-child(2)>br').nextSibling.textContent.trim()

    // @ts-ignore
    this._lastUpdatedChapter = document.querySelector('ul.synopsises_font>li:nth-child(2)>span:nth-child(13)').textContent as string

    // @ts-ignore
    const dateString = document.querySelector('ul.synopsises_font>li:nth-child(2)>span:nth-child(16)').nextSibling.textContent.trim()
    this._lastUpdatedTime = new Date(dateString)

    this._chapters = []
    const nodes = document.querySelectorAll('.comic_Serial_list > a')

    // @ts-ignore
    for (const node of nodes) {
      this._chapters.push(new SFWebComicChapter(
        node.textContent,
        'https://manhua.sfacg.com' + node.getAttribute('href'),
      ))
    }

    this._updated = true
  }

  public async fetchCoverUrl(): Promise<string> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._coverUrl
  }

  public async fetchAuthor(): Promise<string> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._author
  }

  public async fetchSummary(): Promise<string> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._summary
  }

  public async fetchCatalog(): Promise<string> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._catalog
  }

  public async fetchLastUpdatedChapter(): Promise<string> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._lastUpdatedChapter
  }

  public async fetchLastUpdatedTime(): Promise<Date> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._lastUpdatedTime
  }

  public async fetchChapters(): Promise<IWebComicChapter[]> {
    if (!this._updated) {
      await this.updateInfo()
    }

    return this._chapters
  }

  startDownloadTask(targetDir: string): Observable<ITaskStatus> {
    // @ts-ignore
    return new Observable(async subscriber => {
      const chapters = await this.fetchChapters()

      let total = 0
      for (const chapter of chapters) {
        const images = await chapter.fetchImages()
        total += images.length
      }
      let current = 0

      const targetComicFolderPath = path.join(targetDir, this.name)
      for (const chapter of chapters) {
        await new Promise(resolve => {
          chapter.startDownloadTask(targetComicFolderPath).subscribe(downloadStatus => {
            subscriber.next({
              completed: current + downloadStatus.progress.current === total,
              progress: {
                current: current + downloadStatus.progress.current,
                total: total,
                status: downloadStatus.progress.status,
              }
            })
            if (downloadStatus.completed) {
              current += downloadStatus.progress.total
              resolve()
            }
          })
        })
      }
    })
  }
}


class SFWebComicChapter implements IWebComicChapter {
  public readonly name: string
  public readonly sourcePageUrl: string

  private _updated: boolean
  private _images: IWebComicImage[]

  constructor(name: string, sourcePageUrl: string) {
    this.name = name
    this.sourcePageUrl = sourcePageUrl
    this._updated = false
    this._images = []
  }

  public async updateInfo() {
    const {document} = new JSDOM(await fetchText(this.sourcePageUrl)).window

    // @ts-ignore
    const text = await fetchText('https:' + document.querySelector('head > script:nth-child(7)').src)

    // @ts-ignore
    const host = /hosts = \["([^"]+)"/g.exec(text)[1]

    const images: IWebComicImage[] = []
    let matched
    const re = /picAy\[(\d+)\] = "([^"]+)"/g
    while ((matched = re.exec(text)) !== null) {
      images.push({
        name: `${+matched[1] + 1}`.padStart(3, '0') + '.jpg',
        imageUrl: host + matched[2],
      })
    }

    this._images = images
    this._updated = true
  }

  public async fetchImages(): Promise<IWebComicImage[]> {
    if (!this._updated) {
      await this.updateInfo()
    }
    return this._images
  }

  public startDownloadTask(targetDir: string): Observable<ITaskStatus> {
    // @ts-ignore
    return new Observable(async subscriber => {
      const chapterDir = path.join(targetDir, this.name)

      const images = await this.fetchImages()

      if (await fs.pathExists(path.join(chapterDir, '.done'))) {
        subscriber.next({
          completed: true,
          progress: {
            current: this._images.length,
            total: this._images.length,
            status: `下載完 ${this.name}`,
          }
        })
        subscriber.complete()
        return
      }

      await fs.ensureDir(chapterDir)
      // @ts-ignore
      for (const [index, image] of images.entries()) {
        const imagePath = path.join(chapterDir, image.name)
        await downloadFile(image.imageUrl, imagePath)
        subscriber.next({
          completed: index === images.length - 1,
          progress: {
            current: index + 1,
            total: images.length,
            status: `下載完 ${imagePath}`,
          }
        })
      }

      await fs.writeJson(targetDir + '/.done', null)
      subscriber.complete()
    })
  }
}