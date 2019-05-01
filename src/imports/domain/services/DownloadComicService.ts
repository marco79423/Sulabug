import {inject, injectable} from 'inversify'

import types from '../types'
import DownloadTask from '../entities/DownloadTask'
import {
  IComicInfoRepository,
  IDownloadComicService,
  IDownloadTaskRepository,
  IUserProfileRepository
} from '../interfaces'

@injectable()
export default class DownloadComicService implements IDownloadComicService {
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.DownloadTaskRepository) downloadTaskRepository: IDownloadTaskRepository,
  ) {
    this._userProfileRepository = userProfileRepository
    this._comicInfoRepository = comicInfoRepository
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncDownload = async (downloadTask: DownloadTask): Promise<void> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const comicInfo = await this._comicInfoRepository.asyncGetById(downloadTask.comicInfoIdentity)
    const comicSource = comicInfo.getAvailableSource()
    await comicSource.asyncDownload(downloadFolderPath, (progress, done) => {
      if (done) {
        downloadTask.finish()
      }
      downloadTask.updateProgress(progress)
    })

    await this._downloadTaskRepository.delete(downloadTask.identity)
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
