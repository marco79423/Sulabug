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

  public readonly name: string
  public readonly coverImage: {
    id: string,
    comicInfoId: string,
    mediaType: string,
    base64Content: string,
  }
  public readonly sourceUrl: string
  public status: DownloadStatus
  public progress: number

  constructor(
    identity: string,
    name: string,
    coverImage: {
      id: string,
      comicInfoId: string,
      mediaType: string,
      base64Content: string,
    },
    sourceUrl: string,
    downloadTaskRepository: DownloadTaskRepository
  ) {
    super(identity)
    this.name = name
    this.coverImage = coverImage
    this.sourceUrl = sourceUrl
    this.status = DownloadStatus.WAITING
    this.progress = 0

    this._downloadTaskRepository = downloadTaskRepository
  }

  serialize() {
    return {
      id: this.identity,
      name: this.name,
      coverImage: this.coverImage,
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
