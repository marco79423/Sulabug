import {Entity} from '../../base-types'
import {IDownloadTaskRepository} from '../interfaces'


export enum DownloadStatus {
  WAITING = 'WAITING',
  PREPARING = 'PREPARING',
  DOWNLOADING = 'DOWNLOADING',
  FINISHED = 'FINISHED',
}

export default class DownloadTask extends Entity {
  private _downloadTaskRepository: IDownloadTaskRepository

  public readonly comicInfoIdentity: string
  public readonly name: string
  public readonly coverDataUrl: string
  public status: DownloadStatus
  public progress: number

  constructor(
    identity: string,
    comicInfoIdentity: string,
    name: string,
    coverDataUrl: string,
    downloadTaskRepository: IDownloadTaskRepository
  ) {
    super(identity)
    this.comicInfoIdentity = comicInfoIdentity
    this.name = name
    this.coverDataUrl = coverDataUrl
    this.status = DownloadStatus.WAITING
    this.progress = 0

    this._downloadTaskRepository = downloadTaskRepository
  }

  serialize() {
    return {
      id: this.identity,
      comicInfoId: this.comicInfoIdentity,
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

  addProgress(progress: number) {
    if (this.status !== DownloadStatus.DOWNLOADING) {
      this.status = DownloadStatus.DOWNLOADING
    }

    this.progress += progress
    if (this.progress >= 100) {
      this.progress = 100
    }

    if (this.progress === 100) {
      this.status = DownloadStatus.FINISHED
    }

    this._downloadTaskRepository.saveOrUpdate(this)
  }
}
