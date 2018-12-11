import {inject, injectable} from 'inversify'
import * as fs from 'fs-extra'
import * as path from 'path'

import generalTypes from '../../../general/generalTypes'
import {SFComicDownloadAdapter} from '../../../../domain/downloader/interfaces/adapters'
import {SFSourceSite} from '../../../general/interfaces/source-sites'
import DownloadTask from '../../../../domain/downloader/entities/DownloadTask'
import {NetHandler} from '../../../general/interfaces/bases'
import coreTypes from '../../../../domain/core/coreTypes'
import {QueryConfigUseCase} from '../../../../domain/core/interfaces/use-cases'

@injectable()
export default class SFComicDownloadAdapterImpl implements SFComicDownloadAdapter {
  private readonly _queryConfigUseCase: QueryConfigUseCase
  private readonly _sfSourceSite: SFSourceSite
  private readonly _netHandler: NetHandler

  public constructor(
    @inject(coreTypes.QueryConfigUseCase) queryConfigUseCase: QueryConfigUseCase,
    @inject(generalTypes.SFSourceSite) sfSourceSite: SFSourceSite,
    @inject(generalTypes.NetHandler) netHandler: NetHandler,
  ) {
    this._queryConfigUseCase = queryConfigUseCase
    this._sfSourceSite = sfSourceSite
    this._netHandler = netHandler
  }

  async asyncDownload(downloadTask: DownloadTask): Promise<void> {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const chapters = await this._sfSourceSite.asyncGetAllChaptersByComicPageUrl(downloadTask.sourceUrl)

    const progressUnit = Math.floor(100 / (chapters.length + 1))

    downloadTask.addProgress(progressUnit)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      const targetDir = path.join(downloadFolderPath, downloadTask.name, chapter.name)
      await this._asyncDownloadChapter(chapter.pageUrl, targetDir)
      downloadTask.addProgress(progressUnit)
    }
    downloadTask.finish()
  }

  private async _asyncDownloadChapter(pageUrl: string, targetDir: string): Promise<void> {
    await fs.ensureDir(targetDir)
    const images = await this._sfSourceSite.asyncGetAllImagesFromChapterPageUrl(pageUrl)
    for (const image of images) {
      const imagePath = path.join(targetDir, image.name)
      await this._netHandler.asyncDownload(image.imageUrl, imagePath)
    }
  }

  private async _asyncGetDownloadFolderPath() {
    const res = await this._queryConfigUseCase.asyncExecute()
    const config = res.data
    return config.downloadFolderPath
  }
}
