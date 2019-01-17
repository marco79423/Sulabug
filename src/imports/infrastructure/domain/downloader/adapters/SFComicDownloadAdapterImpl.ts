import {inject, injectable} from 'inversify'
import * as path from 'path'

import generalTypes from '../../../../domain/general/generalTypes'
import infraTypes from '../../../infraTypes'
import {ISFComicDownloadAdapter} from '../../../../domain/downloader/interfaces'
import DownloadTask from '../../../../domain/downloader/entities/DownloadTask'
import {ISFSourceSite} from '../../../shared/interfaces'
import {IFileHandler, INetHandler} from '../../../vendor/interfaces'
import {IConfigRepository} from '../../../../domain/general/interfaces'


@injectable()
export default class SFComicDownloadAdapterImpl implements ISFComicDownloadAdapter {
  private readonly _configRepository: IConfigRepository
  private readonly _sfSourceSite: ISFSourceSite
  private readonly _fileHandler: IFileHandler
  private readonly _netHandler: INetHandler

  public constructor(
    @inject(generalTypes.ConfigRepository) configRepository: IConfigRepository,
    @inject(infraTypes.SFSourceSite) sfSourceSite: ISFSourceSite,
    @inject(infraTypes.FileHandler) fileHandler: IFileHandler,
    @inject(infraTypes.NetHandler) netHandler: INetHandler,
  ) {
    this._configRepository = configRepository
    this._sfSourceSite = sfSourceSite
    this._fileHandler = fileHandler
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
    await this._fileHandler.asyncEnsureDir(targetDir)
    const images = await this._sfSourceSite.asyncGetAllImagesFromChapterPageUrl(pageUrl)
    for (const image of images) {
      const imagePath = path.join(targetDir, image.name)
      await this._netHandler.asyncDownload(image.imageUrl, imagePath)
    }
  }

  private async _asyncGetDownloadFolderPath() {
    const config = await this._configRepository.asyncGet()
    return config.downloadFolderPath
  }
}
