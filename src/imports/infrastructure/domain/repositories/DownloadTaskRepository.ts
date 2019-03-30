import {inject, injectable} from 'inversify'

import types from '../../../domain/types'
import EventPublisher from '../../../domain/event/EventPublisher'
import DownloadTask from '../../../domain/entities/DownloadTask'
import DownloadTaskUpdatedEvent from '../../../domain/event/DownloadTaskUpdatedEvent'
import {IDownloadTaskRepository} from '../../../domain/interfaces'


@injectable()
export default class DownloadTaskRepository implements IDownloadTaskRepository {
  private readonly _eventPublisher: EventPublisher
  private downloadTaskIds: string[] = []
  private downloadTaskMap = {}

  public constructor(
    @inject(types.EventPublisher) eventPublisher: EventPublisher
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
