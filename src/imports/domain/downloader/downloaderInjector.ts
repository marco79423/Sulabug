import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {SFComicDownloadAdapter} from './interfaces'
import {DownloadTaskFactory} from './interfaces'
import {DownloadTaskRepository} from './interfaces'
import DownloadTaskRepositoryImpl from '../../infrastructure/domain/downloader/repositories/DownloadTaskRepositoryImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import SFComicDownloadAdapterImpl from '../../infrastructure/domain/downloader/adapters/SFComicDownloadAdapterImpl'

const downloaderInjector = new Container()

downloaderInjector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()

downloaderInjector.bind<SFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapterImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

export default downloaderInjector
