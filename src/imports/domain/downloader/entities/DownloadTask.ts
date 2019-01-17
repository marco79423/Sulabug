import {Entity} from '../../base-types'
import {DownloadTaskRepository} from '../interfaces'


export enum DownloadStatus {
  WAITING = 'WAITING',
  PREPARING = 'PREPARING',
  DOWNLOADING = 'DOWNLOADING',
  FINISHED = 'FINISHED',
}

export default class DownloadTask extends Entity {
  private _downloadTaskRepository: DownloadTaskRepository

  public readonly name: string
  public readonly coverDataUrl: string
  public readonly sourceUrl: string
  public status: DownloadStatus
  public progress: number

  constructor(
    identity: string,
    name: string,
    coverDataUrl: string,
    sourceUrl: string,
    downloadTaskRepository: DownloadTaskRepository
  ) {
    super(identity)
    this.name = name
    this.coverDataUrl = coverDataUrl
    this.sourceUrl = sourceUrl
    this.status = DownloadStatus.WAITING
    this.progress = 0

    this._downloadTaskRepository = downloadTaskRepository
  }

  serialize() {
    return {
      id: this.identity,
      name: this.name,
      coverDataUrl: this.coverDataUrl,
      sourceUrl: this.sourceUrl,
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
