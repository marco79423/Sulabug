import {Entity} from '../base-types'
import {IDownloadTaskRepository} from '../interfaces'


export enum DownloadStatus {
  WAITING = 'WAITING',
  PREPARING = 'PREPARING',
  DOWNLOADING = 'DOWNLOADING',
  FINISHED = 'FINISHED',
}

export default class DownloadTask extends Entity {
  private _downloadTaskRepository: IDownloadTaskRepository

  public readonly comicIdentity: string
  public readonly name: string
  public readonly coverDataUrl: string
  public status: DownloadStatus
  public progress: number

  constructor(
    identity: string,
    comicIdentity: string,
    name: string,
    coverDataUrl: string,
    downloadTaskRepository: IDownloadTaskRepository
  ) {
    super(identity)
    this.comicIdentity = comicIdentity
    this.name = name
    this.coverDataUrl = coverDataUrl
    this.status = DownloadStatus.WAITING
    this.progress = 0

    this._downloadTaskRepository = downloadTaskRepository
  }

  serialize() {
    return {
      id: this.identity,
      comicId: this.comicIdentity,
      name: this.name,
      coverDataUrl: this.coverDataUrl,
      status: this.status,
      progress: this.progress,
    }
  }

  finish() {
    this.progress = 100
    this.status = DownloadStatus.FINISHED

    this._downloadTaskRepository.saveOrUpdate(this)
  }

  updateProgress(progress: number) {
    if (this.status !== DownloadStatus.DOWNLOADING) {
      this.status = DownloadStatus.DOWNLOADING
    }

    this.progress = progress
    if (this.progress >= 100) {
      this.progress = 100
    }

    if (this.progress === 100) {
      this.status = DownloadStatus.FINISHED
    }

    this._downloadTaskRepository.saveOrUpdate(this)
  }
}
