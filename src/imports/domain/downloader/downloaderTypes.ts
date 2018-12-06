export default {
  FileAdapter: Symbol('Downloader/FileAdapter'),
  NetAdapter: Symbol('Downloader/NetAdapter'),

  ConfigFactory: Symbol('Downloader/ConfigFactory'),
  DownloadTaskFactory: Symbol('Downloader/DownloadTaskFactory'),

  ConfigRepository: Symbol('Downloader/ConfigRepository'),
  DownloadTaskRepository: Symbol('Downloader/DownloadTaskRepository'),

  SFDownloadComicService: Symbol('Downloader/SFDownloadComicService'),

  CreateDownloadTaskUseCase: Symbol('Downloader/CreateDownloadTaskUseCase'),
  DeleteDownloadTaskUseCase: Symbol('Downloader/DeleteDownloadTaskUseCase'),
  DownloadComicUseCase: Symbol('Downloader/DownloadComicUseCase'),
  QueryDownloadTasksUseCase: Symbol('Downloader/QueryDownloadTasksUseCase'),
}
