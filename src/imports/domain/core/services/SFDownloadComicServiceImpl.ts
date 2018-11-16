import {inject, injectable} from 'inversify'
import * as cheerio from 'cheerio'
import * as fs from 'fs-extra'
import * as path from 'path'

import coreTypes from '../coreTypes'
import DownloadTask from '../entities/DownloadTask'
import {SFDownloadComicService} from '../interfaces/services'
import {ComicInfoStorageRepository, ConfigRepository} from '../interfaces/repositories'
import {NetAdapter} from '../interfaces/adapters'

@injectable()
export default class SFDownloadComicServiceImpl implements SFDownloadComicService {
  private readonly _configRepository: ConfigRepository
  private readonly _netService: NetAdapter
  private readonly _comicInfoStorageRepository: ComicInfoStorageRepository

  public constructor(
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository,
    @inject(coreTypes.NetAdapter) netService: NetAdapter,
    @inject(coreTypes.ComicInfoStorageRepository) comicInfoStorageRepository: ComicInfoStorageRepository,
  ) {
    this._configRepository = configRepository
    this._netService = netService
    this._comicInfoStorageRepository = comicInfoStorageRepository
  }

  async asyncDownload(downloadTask: DownloadTask): Promise<void> {
    const config = await this._configRepository.asyncGet()
    const comicInfo = await this._comicInfoStorageRepository.asyncGetById(downloadTask.comicInfoIdentity)
    if (!comicInfo) {
      return
    }

    const $ = await this._asyncGetSelector(comicInfo.pageUrl)
    const chapters: { sourceUrl: string, targetDir: string }[] = []
    $('.comic_Serial_list a').each((index, element) => {
      chapters.push({
        sourceUrl: 'https://manhua.sfacg.com' + $(element).attr('href'),
        targetDir: path.join(config.comicsFolder, comicInfo.name, $(element).text()),
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

  private async _asyncGetSelector(url: string) {
    const text = await this._netService.asyncGetText(url)
    return cheerio.load(text)
  }
}
