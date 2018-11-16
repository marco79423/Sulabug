export default {
  FileAdapter: Symbol('Core/FileAdapter'),
  NetAdapter: Symbol('Core/NetAdapter'),

  ComicInfoFactory: Symbol('Core/ComicInfoFactory'),
  ConfigFactory: Symbol('Core/ConfigFactory'),
  CoverImageFactory: Symbol('Core/CoverImageFactory'),
  DownloadTaskFactory: Symbol('Core/DownloadTaskFactory'),

  ComicInfoStorageRepository: Symbol('Core/ComicInfoStorageRepository'),
  ConfigRepository: Symbol('Core/ConfigRepository'),
  DownloadTaskRepository: Symbol('Core/DownloadTaskRepository'),

  SFComicInfoQueryService: Symbol('Core/SFComicInfoQueryService'),
  SFDownloadComicService: Symbol('Core/SFDownloadComicService'),
}
