import {inject, injectable} from 'inversify'

import types from '../types'
import DownloadTask from '../entities/DownloadTask'
import {
  IComicInfoRepository,
  IComicSourceSiteService,
  IDownloadComicService,
  IDownloadTaskRepository,
  IFileAdapter,
  INetAdapter,
  IUserProfileRepository
} from '../interfaces'
import * as path from 'path'

@injectable()
export default class DownloadComicService implements IDownloadComicService {
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _sfComicSourceSite: IComicSourceSiteService
  private readonly _fileAdapter: IFileAdapter
  private readonly _netAdapter: INetAdapter
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.SFComicSourceSiteService) sfComicSourceSite: IComicSourceSiteService,
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
    @inject(types.NetAdapter) netAdapter: INetAdapter,
    @inject(types.DownloadTaskRepository) downloadTaskRepository: IDownloadTaskRepository,
  ) {
    this._userProfileRepository = userProfileRepository
    this._comicInfoRepository = comicInfoRepository
    this._sfComicSourceSite = sfComicSourceSite
    this._fileAdapter = fileAdapter
    this._netAdapter = netAdapter
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncDownload = async (downloadTask: DownloadTask): Promise<void> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const comicInfo = await this._comicInfoRepository.asyncGetById(downloadTask.comicInfoIdentity)
    const chapters = comicInfo.chapters

    const progressUnit = Math.floor(100 / (chapters.length + 1))

    const targetComicFolderPath = path.join(downloadFolderPath, downloadTask.name)

    await this._fileAdapter.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: comicInfo.identity})
    downloadTask.addProgress(progressUnit)
    for (let index = 0; index < chapters.length; index++) {
      const chapter = chapters[index]
      const targetComicChapterFolderPath = path.join(targetComicFolderPath, chapter.name)
      await this._asyncDownloadChapter(chapter.sourcePageUrl, targetComicChapterFolderPath)
      downloadTask.addProgress(progressUnit)
    }
    downloadTask.finish()


    await this._downloadTaskRepository.delete(downloadTask.identity)
  }

  private async _asyncDownloadChapter(pageUrl: string, targetDir: string): Promise<void> {
    if (await this._fileAdapter.asyncPathExists(path.join(targetDir, '.done'))) {
      return
    }

    await this._fileAdapter.asyncEnsureDir(targetDir)
    const images = await this._sfComicSourceSite.asyncGetAllImagesFromChapterPageUrl(pageUrl)
    for (const image of images) {
      const imagePath = path.join(targetDir, image.name)
      await this._netAdapter.asyncDownload(image.imageUrl, imagePath)
    }

    await this._fileAdapter.asyncWriteJson(targetDir + '/.done', null)
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
