import {Entity} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces/repositories'


export enum DownloadStatus {
  WAITING = 'WAITING',
  PREPARING = 'PREPARING',
  DOWNLOADING = 'DOWNLOADING',
  FINISHED = 'FINISHED',
}

export default class DownloadTask extends Entity {
  private _downloadTaskRepository: DownloadTaskRepository

  public readonly comicInfoIdentity: string
  public status: DownloadStatus
  public progress: number

  constructor(
    identity: string,
    comicInfoIdentity: string,
    downloadTaskRepository: DownloadTaskRepository
  ) {
    super(identity)
    this.comicInfoIdentity = comicInfoIdentity
    this.status = DownloadStatus.WAITING
    this.progress = 0

    this._downloadTaskRepository = downloadTaskRepository
  }

  serialize() {
    return {
      id: this.identity,
      comicInfoId: this.comicInfoIdentity,
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
