import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {ISFComicDownloadAdapter} from './interfaces'
import {IDownloadTaskFactory} from './interfaces'
import {IDownloadTaskRepository} from './interfaces'
import DownloadTaskRepositoryImpl from '../../infrastructure/domain/downloader/repositories/DownloadTaskRepositoryImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import SFComicDownloadAdapterImpl from '../../infrastructure/domain/downloader/adapters/SFComicDownloadAdapterImpl'

const downloaderInjector = new Container()

downloaderInjector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()

downloaderInjector.bind<ISFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapterImpl).inSingletonScope()

downloaderInjector.bind<IDownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

downloaderInjector.bind<IDownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

export default downloaderInjector
