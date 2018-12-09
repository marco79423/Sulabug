import {Container} from 'inversify'

import downloaderTypes from './downloaderTypes'
import EventPublisher from './event/EventPublisher'
import {FileAdapter, NetAdapter} from './interfaces/adapters'
import {DownloadTaskFactory} from './interfaces/factories'
import {DownloadTaskRepository} from './interfaces/repositories'
import {SFDownloadComicService} from './interfaces/services'
import CreateDownloadTaskUseCaseImpl from './use-cases/CreateDownloadTaskUseCaseImpl'
import DeleteDownloadTaskUseCaseImpl from './use-cases/DeleteDownloadTaskUseCaseImpl'
import QueryDownloadTasksUseCaseImpl from './use-cases/QueryDownloadTasksUseCaseImpl'
import DownloadComicUseCaseImpl from './use-cases/DownloadComicUseCaseImpl'
import SFDownloadComicServiceImpl from './services/SFDownloadComicServiceImpl'
import DownloadTaskRepositoryImpl from '../../infrastructure/downloader/repositories/DownloadTaskRepositoryImpl'
import FileAdapterImpl from '../../infrastructure/downloader/adapters/FileAdapterImpl'
import NetAdapterImpl from '../../infrastructure/downloader/adapters/NetAdapterImpl'
import DownloadTaskFactoryImpl from './factories/DownloadTaskFactoryImpl'
import {
  CreateDownloadTaskUseCase,
  DeleteDownloadTaskUseCase,
  DownloadComicUseCase,
  QueryDownloadTasksUseCase
} from './interfaces/use-cases'

const downloaderInjector = new Container()

downloaderInjector.bind(EventPublisher).toSelf().inSingletonScope()

downloaderInjector.bind<FileAdapter>(downloaderTypes.FileAdapter).to(FileAdapterImpl).inSingletonScope()
downloaderInjector.bind<NetAdapter>(downloaderTypes.NetAdapter).to(NetAdapterImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskFactory>(downloaderTypes.DownloadTaskFactory).to(DownloadTaskFactoryImpl).inSingletonScope()

downloaderInjector.bind<DownloadTaskRepository>(downloaderTypes.DownloadTaskRepository).to(DownloadTaskRepositoryImpl).inSingletonScope()

downloaderInjector.bind<SFDownloadComicService>(downloaderTypes.SFDownloadComicService).to(SFDownloadComicServiceImpl).inSingletonScope()

downloaderInjector.bind<CreateDownloadTaskUseCase>(downloaderTypes.CreateDownloadTaskUseCase).to(CreateDownloadTaskUseCaseImpl).inSingletonScope()
downloaderInjector.bind<DeleteDownloadTaskUseCase>(downloaderTypes.DeleteDownloadTaskUseCase).to(DeleteDownloadTaskUseCaseImpl).inSingletonScope()
downloaderInjector.bind<QueryDownloadTasksUseCase>(downloaderTypes.QueryDownloadTasksUseCase).to(QueryDownloadTasksUseCaseImpl).inSingletonScope()
downloaderInjector.bind<DownloadComicUseCase>(downloaderTypes.DownloadComicUseCase).to(DownloadComicUseCaseImpl).inSingletonScope()

export default downloaderInjector
