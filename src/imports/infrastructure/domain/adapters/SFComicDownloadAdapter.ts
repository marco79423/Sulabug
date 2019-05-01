import {inject, injectable} from 'inversify'
import * as path from 'path'

import types from '../../../domain/types'
import {
  IComicInfoRepository,
  IComicSourceSiteService,
  IFileService,
  INetService,
  ISFComicDownloadAdapter,
  IUserProfileRepository
} from '../../../domain/interfaces'
import DownloadTask from '../../../domain/entities/DownloadTask'


@injectable()
export default class SFComicDownloadAdapter implements ISFComicDownloadAdapter {
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _sfComicSourceSite: IComicSourceSiteService
  private readonly _fileService: IFileService
  private readonly _netService: INetService

  public constructor(
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.SFComicSourceSiteService) sfComicSourceSite: IComicSourceSiteService,
    @inject(types.FileService) fileService: IFileService,
    @inject(types.NetService) netService: INetService,
  ) {
    this._userProfileRepository = userProfileRepository
    this._comicInfoRepository = comicInfoRepository
    this._sfComicSourceSite = sfComicSourceSite
    this._fileService = fileService
    this._netService = netService
  }

  async asyncDownload(downloadTask: DownloadTask): Promise<void> {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const comicInfo = await this._comicInfoRepository.asyncGetById(downloadTask.comicInfoIdentity)
    const chapters = comicInfo.chapters

    const progressUnit = Math.floor(100 / (chapters.length + 1))

    const targetComicFolderPath = path.join(downloadFolderPath, downloadTask.name)

    await this._fileService.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: comicInfo.identity})
    downloadTask.addProgress(progressUnit)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      const targetComicChapterFolderPath = path.join(targetComicFolderPath, chapter.name)
      await this._asyncDownloadChapter(chapter.sourcePageUrl, targetComicChapterFolderPath)
      downloadTask.addProgress(progressUnit)
    }
    downloadTask.finish()
  }

  private async _asyncDownloadChapter(pageUrl: string, targetDir: string): Promise<void> {
    if (await this._fileService.asyncPathExists(path.join(targetDir, '.done'))) {
      return
    }

    await this._fileService.asyncEnsureDir(targetDir)
    const images = await this._sfComicSourceSite.asyncGetAllImagesFromChapterPageUrl(pageUrl)
    for (const image of images) {
      const imagePath = path.join(targetDir, image.name)
      await this._netService.asyncDownload(image.imageUrl, imagePath)
    }

    await this._fileService.asyncWriteJson(targetDir + '/.done', null)
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
