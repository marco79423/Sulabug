import {inject, injectable} from 'inversify'

import downloaderTypes from '../downloaderTypes'
import DownloadTask from '../entities/DownloadTask'
import {IDownloadComicService, ISFComicDownloadAdapter} from '../interfaces'


@injectable()
export default class DownloadComicService implements IDownloadComicService {
  private readonly _sfComicDownloadAdapter: ISFComicDownloadAdapter

  constructor(
    @inject(downloaderTypes.SFComicDownloadAdapter) sfComicDownloadAdapter: ISFComicDownloadAdapter
  ) {
    this._sfComicDownloadAdapter = sfComicDownloadAdapter
  }

  asyncDownload = async (downloadTask: DownloadTask): Promise<void> => {
    await this._sfComicDownloadAdapter.asyncDownload(downloadTask)
  }
}
