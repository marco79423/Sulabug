import {inject, injectable} from 'inversify'

import types from '../types'
import DownloadTask from '../entities/DownloadTask'
import {IDownloadComicService, IDownloadTaskRepository, ISFComicDownloadAdapter} from '../interfaces'

@injectable()
export default class DownloadComicService implements IDownloadComicService {
  private readonly _sfComicDownloadAdapter: ISFComicDownloadAdapter
  private readonly _downloadTaskRepository: IDownloadTaskRepository

  constructor(
    @inject(types.SFComicDownloadAdapter) sfComicDownloadAdapter: ISFComicDownloadAdapter,
    @inject(types.DownloadTaskRepository) downloadTaskRepository: IDownloadTaskRepository,
  ) {
    this._sfComicDownloadAdapter = sfComicDownloadAdapter
    this._downloadTaskRepository = downloadTaskRepository
  }

  asyncDownload = async (downloadTask: DownloadTask): Promise<void> => {
    await this._sfComicDownloadAdapter.asyncDownload(downloadTask)
    await this._downloadTaskRepository.delete(downloadTask.identity)
  }
}
