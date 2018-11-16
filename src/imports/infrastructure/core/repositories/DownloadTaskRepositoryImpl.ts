import {inject, injectable} from 'inversify'
import EventPublisher from '../../../domain/core/event/EventPublisher'
import DownloadTask from '../../../domain/core/entities/DownloadTask'
import DownloadTaskUpdatedEvent from '../../../domain/core/event/DownloadTaskUpdatedEvent'
import {DownloadTaskRepository} from '../../../domain/core/interfaces/repositories'


@injectable()
export default class DownloadTaskRepositoryImpl implements DownloadTaskRepository {
  private readonly _eventPublisher: EventPublisher

  public constructor(
    @inject(EventPublisher) eventPublisher: EventPublisher
  ) {
    this._eventPublisher = eventPublisher
  }

  private downloadTaskIds: string[] = []
  private downloadTaskMap = {}

  saveOrUpdate(downloadTask: DownloadTask): void {
    if (!this.downloadTaskIds.includes(downloadTask.identity)) {
      this.downloadTaskIds.push(downloadTask.identity)
    }
    this.downloadTaskMap[downloadTask.identity] = downloadTask
    this._eventPublisher.sendEvent(new DownloadTaskUpdatedEvent())
  }

  getById(identity: string): DownloadTask {
    return this.downloadTaskMap[identity]
  }

  getAll(): DownloadTask[] {
    return this.downloadTaskIds.map(downloadTaskId => this.downloadTaskMap[downloadTaskId])
  }

  delete(identity: string): void {
    this.downloadTaskIds = this.downloadTaskIds.filter(downloadTaskId => downloadTaskId !== identity)
    delete this.downloadTaskMap[identity]
  }
}
