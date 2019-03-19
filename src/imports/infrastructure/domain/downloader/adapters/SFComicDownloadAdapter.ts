import {inject, injectable} from 'inversify'
import * as path from 'path'

import generalTypes from '../../../../domain/general/generalTypes'
import infraTypes from '../../../infraTypes'
import {ISFComicDownloadAdapter} from '../../../../domain/downloader/interfaces'
import DownloadTask from '../../../../domain/downloader/entities/DownloadTask'
import {ISFSourceSite} from '../../../shared/interfaces'
import {IFileService, INetService, IUserProfileRepository} from '../../../../domain/general/interfaces'
import libraryTypes from '../../../../domain/library/libraryTypes'
import {IComicInfoRepository} from '../../../../domain/library/interfaces'


@injectable()
export default class SFComicDownloadAdapter implements ISFComicDownloadAdapter {
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _sfSourceSite: ISFSourceSite
  private readonly _fileService: IFileService
  private readonly _netService: INetService

  public constructor(
    @inject(generalTypes.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(libraryTypes.ComicInfoInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(infraTypes.SFSourceSite) sfSourceSite: ISFSourceSite,
    @inject(generalTypes.FileService) fileService: IFileService,
    @inject(generalTypes.NetService) netService: INetService,
  ) {
    this._userProfileRepository = userProfileRepository
    this._comicInfoRepository = comicInfoRepository
    this._sfSourceSite = sfSourceSite
    this._fileService = fileService
    this._netService = netService
  }

  async asyncDownload(downloadTask: DownloadTask): Promise<void> {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const comicInfo = await this._comicInfoRepository.asyncGetById(downloadTask.comicInfoIdentity)
    const chapters = comicInfo.chapters

    const progressUnit = Math.floor(100 / (chapters.length + 1))

    downloadTask.addProgress(progressUnit)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      const targetDir = path.join(downloadFolderPath, downloadTask.name, chapter.name)
      await this._asyncDownloadChapter(chapter.sourcePageUrl, targetDir)
      downloadTask.addProgress(progressUnit)
    }
    downloadTask.finish()
  }

  private async _asyncDownloadChapter(pageUrl: string, targetDir: string): Promise<void> {
    if (await this._fileService.asyncPathExists(targetDir + '/.done')) {
      return
    }

    await this._fileService.asyncEnsureDir(targetDir)
    const images = await this._sfSourceSite.asyncGetAllImagesFromChapterPageUrl(pageUrl)
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
