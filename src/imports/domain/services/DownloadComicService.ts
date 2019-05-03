import {inject, injectable} from 'inversify'

import types from '../types'
import DownloadTask from '../entities/DownloadTask'
import {
  IComicRepository,
  IDownloadComicService,
  IDownloadTaskRepository,
  IUserProfileRepository
} from '../interfaces'

@injectable()
export default class DownloadComicService implements IDownloadComicService {
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicRepository: IComicRepository
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.ComicRepository) comicRepository: IComicRepository,
    @inject(types.DownloadTaskRepository) downloadTaskRepository: IDownloadTaskRepository,
  ) {
    this._userProfileRepository = userProfileRepository
    this._comicRepository = comicRepository
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncDownload = async (downloadTask: DownloadTask): Promise<void> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const comic = await this._comicRepository.asyncGetById(downloadTask.comicId)
    const comicSource = comic.getAvailableSource()
    await comicSource.asyncDownload(downloadFolderPath, (progress, done) => {
      if (done) {
        downloadTask.finish()
      }
      downloadTask.updateProgress(progress)
    })

    await this._downloadTaskRepository.delete(downloadTask.id)
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
