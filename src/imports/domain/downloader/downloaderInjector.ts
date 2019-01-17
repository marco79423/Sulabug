import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {ISFComicDownloadAdapter} from './interfaces'
import {IDownloadTaskFactory} from './interfaces'
import {IDownloadTaskRepository} from './interfaces'
import DownloadTaskRepository from '../../infrastructure/domain/downloader/repositories/DownloadTaskRepository'
import DownloadTaskFactory from './factories/DownloadTaskFactory'
import SFComicDownloadAdapter from '../../infrastructure/domain/downloader/adapters/SFComicDownloadAdapter'

const downloaderInjector = new Container()

downloaderInjector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()

downloaderInjector.bind<ISFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapter).inSingletonScope()

downloaderInjector.bind<IDownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactory).inSingletonScope()

downloaderInjector.bind<IDownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepository).inSingletonScope()

export default downloaderInjector
