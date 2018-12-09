import {inject, injectable} from 'inversify'
import * as cheerio from 'cheerio'
import * as fs from 'fs-extra'
import * as path from 'path'

import coreTypes from '../../core/coreTypes'
import downloaderTypes from '../downloaderTypes'
import DownloadTask from '../entities/DownloadTask'
import {SFDownloadComicService} from '../interfaces/services'
import {NetAdapter} from '../interfaces/adapters'
import {QueryConfigUseCase} from '../../core/interfaces/use-cases'

@injectable()
export default class SFDownloadComicServiceImpl implements SFDownloadComicService {
  private readonly _queryConfigUseCase: QueryConfigUseCase
  private readonly _netService: NetAdapter

  public constructor(
    @inject(coreTypes.QueryConfigUseCase) queryConfigUseCase: QueryConfigUseCase,
    @inject(downloaderTypes.NetAdapter) netService: NetAdapter,
  ) {
    this._queryConfigUseCase = queryConfigUseCase
    this._netService = netService
  }

  async asyncDownload(downloadTask: DownloadTask): Promise<void> {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const $ = await this._asyncGetSelector(downloadTask.sourceUrl)
    const chapters: { sourceUrl: string, targetDir: string }[] = []
    $('.comic_Serial_list a').each((index, element) => {
      chapters.push({
        sourceUrl: 'https://manhua.sfacg.com' + $(element).attr('href'),
        targetDir: path.join(downloadFolderPath, downloadTask.name, $(element).text()),
      })
    })

    const progressUnit = Math.floor(100 / (chapters.length + 1))

    downloadTask.addProgress(progressUnit)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      await this._asyncDownloadChapter(chapter.sourceUrl, chapter.targetDir)

      downloadTask.addProgress(progressUnit)
    }
    downloadTask.finish()
  }

  private async _asyncDownloadChapter(sourceUrl: string, targetDir: string): Promise<void> {
    await fs.ensureDir(targetDir)

    const $ = await this._asyncGetSelector(sourceUrl)

    const url = 'https:' + $('head script')
      .filter((index, element) => $(element).attr('src').includes('//comic.sfacg.com/Utility/'))
      .first()
      .attr('src')

    const text = await this._netService.asyncGetText(url)

    // @ts-ignore
    const host = /hosts = \["([^"]+)"/g.exec(text)[1]

    let matched
    const re = /picAy\[(\d+)\] = "([^"]+)"/g
    while ((matched = re.exec(text)) !== null) {
      const url = host + matched[2]
      const imagePath = path.join(targetDir, `${+matched[1] + 1}`.padStart(3, '0') + '.jpg')
      await this._netService.asyncDownload(url, imagePath)
    }
  }

  private async _asyncGetDownloadFolderPath() {
    const res = await this._queryConfigUseCase.asyncExecute()
    const config = res.data
    return config.downloadFolderPath
  }

  private async _asyncGetSelector(url: string) {
    const text = await this._netService.asyncGetText(url)
    return cheerio.load(text)
  }
}
