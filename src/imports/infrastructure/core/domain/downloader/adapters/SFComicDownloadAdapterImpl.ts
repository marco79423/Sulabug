import {map} from 'rxjs/operators'
import {inject, injectable} from 'inversify'
import * as path from 'path'

import generalTypes from '../../../../../domain/general/generalTypes'
import coreTypes from '../../../coreTypes'
import {SFComicDownloadAdapter} from '../../../../../domain/downloader/interfaces/adapters'
import DownloadTask from '../../../../../domain/downloader/entities/DownloadTask'
import {QueryConfigUseCase} from '../../../../../domain/general/interfaces/use-cases'
import {SFSourceSite} from '../../../interfaces/source-sites'
import {FileHandler, NetHandler} from '../../../../vendor/interfaces/handlers'


@injectable()
export default class SFComicDownloadAdapterImpl implements SFComicDownloadAdapter {
  private readonly _queryConfigUseCase: QueryConfigUseCase
  private readonly _sfSourceSite: SFSourceSite
  private readonly _fileHandler: FileHandler
  private readonly _netHandler: NetHandler

  public constructor(
    @inject(generalTypes.QueryConfigUseCase) queryConfigUseCase: QueryConfigUseCase,
    @inject(coreTypes.SFSourceSite) sfSourceSite: SFSourceSite,
    @inject(coreTypes.FileHandler) fileHandler: FileHandler,
    @inject(coreTypes.NetHandler) netHandler: NetHandler,
  ) {
    this._queryConfigUseCase = queryConfigUseCase
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
    return await this._queryConfigUseCase.execute().pipe(
      map(res => res.data),
      map(config => config.downloadFolderPath),
    ).toPromise()
  }
}
