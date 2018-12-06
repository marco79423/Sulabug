export default {
  FileAdapter: Symbol('Downloader/FileAdapter'),
  NetAdapter: Symbol('Downloader/NetAdapter'),

  ComicInfoFactory: Symbol('Downloader/ComicInfoFactory'),
  ConfigFactory: Symbol('Downloader/ConfigFactory'),
  CoverImageFactory: Symbol('Downloader/CoverImageFactory'),
  DownloadTaskFactory: Symbol('Downloader/DownloadTaskFactory'),

  ComicInfoStorageRepository: Symbol('Downloader/ComicInfoStorageRepository'),
  ConfigRepository: Symbol('Downloader/ConfigRepository'),
  DownloadTaskRepository: Symbol('Downloader/DownloadTaskRepository'),

  SFDownloadComicService: Symbol('Downloader/SFDownloadComicService'),
}
