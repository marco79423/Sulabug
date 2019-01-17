import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {SFComicDownloadAdapter} from './interfaces/adapters'
import {DownloadTaskFactory} from './interfaces/factories'
import {DownloadTaskRepository} from './interfaces/repositories'
import {DeleteDownloadTaskUseCase} from './interfaces/use-cases'
import DeleteDownloadTaskUseCaseImpl from './use-cases/DeleteDownloadTaskUseCaseImpl'
import DownloadTaskRepositoryImpl from '../../infrastructure/domain/downloader/repositories/DownloadTaskRepositoryImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import SFComicDownloadAdapterImpl from '../../infrastructure/domain/downloader/adapters/SFComicDownloadAdapterImpl'

const downloaderInjector = new Container()

downloaderInjector.bind<EventPublisher>(downloaderTypes.EventPublisher).to(EventPublisher).inSingletonScope()

downloaderInjector.bind<SFComicDownloadAdapter>(downloaderTypes.SFComicDownloadAdapter).to(SFComicDownloadAdapterImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

downloaderInjector.bind<DeleteDownloadTaskUseCase>(downloaderTypes.DeleteDownloadTaskUseCase).to(DeleteDownloadTaskUseCaseImpl).inSingletonScope()

export default downloaderInjector
