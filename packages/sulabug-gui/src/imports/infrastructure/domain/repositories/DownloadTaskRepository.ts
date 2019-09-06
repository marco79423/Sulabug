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
    if (!this.downloadTaskIds.includes(downloadTask.id)) {
      this.downloadTaskIds.push(downloadTask.id)
    }
    this.downloadTaskMap[downloadTask.id] = downloadTask
    this._eventPublisher.sendEvent(new DownloadTaskUpdatedEvent())
  }

  getById = (id: string): DownloadTask => {
    return this.downloadTaskMap[id]
  }

  getAll = (): DownloadTask[] => {
    return this.downloadTaskIds.map(downloadTaskId => this.downloadTaskMap[downloadTaskId])
  }

  delete = (id: string): void => {
    this.downloadTaskIds = this.downloadTaskIds.filter(downloadTaskId => downloadTaskId !== id)
    delete this.downloadTaskMap[id]
  }
}
