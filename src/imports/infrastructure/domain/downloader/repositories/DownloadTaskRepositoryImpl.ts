import {inject, injectable} from 'inversify'

import downloaderTypes from '../../../../domain/downloader/downloaderTypes'
import EventPublisher from '../../../../domain/downloader/event/EventPublisher'
import DownloadTask from '../../../../domain/downloader/entities/DownloadTask'
import DownloadTaskUpdatedEvent from '../../../../domain/downloader/event/DownloadTaskUpdatedEvent'
import {IDownloadTaskRepository} from '../../../../domain/downloader/interfaces'


@injectable()
export default class DownloadTaskRepositoryImpl implements IDownloadTaskRepository {
  private readonly _eventPublisher: EventPublisher
  private downloadTaskIds: string[] = []
  private downloadTaskMap = {}

  public constructor(
    @inject(downloaderTypes.EventPublisher) eventPublisher: EventPublisher
  ) {
    this._eventPublisher = eventPublisher
  }

  saveOrUpdate = (downloadTask: DownloadTask): void => {
    if (!this.downloadTaskIds.includes(downloadTask.identity)) {
      this.downloadTaskIds.push(downloadTask.identity)
    }
    this.downloadTaskMap[downloadTask.identity] = downloadTask
    this._eventPublisher.sendEvent(new DownloadTaskUpdatedEvent())
  }

  getById = (identity: string): DownloadTask => {
    return this.downloadTaskMap[identity]
  }

  getAll = (): DownloadTask[] => {
    return this.downloadTaskIds.map(downloadTaskId => this.downloadTaskMap[downloadTaskId])
  }

  delete = (identity: string): void => {
    this.downloadTaskIds = this.downloadTaskIds.filter(downloadTaskId => downloadTaskId !== identity)
    delete this.downloadTaskMap[identity]
  }
}
