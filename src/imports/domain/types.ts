export default {
  EventPublisher: Symbol('Domain/Downloader/EventPublisher'),

  ComicInfoFactory: Symbol('Domain/Library/ComicInfoFactory'),
  ComicSourceFactory: Symbol('Domain/Library/ComicSourceFactory'),
  DownloadTaskFactory: Symbol('Domain/Downloader/DownloadTaskFactory'),
  UserProfileFactory: Symbol('Domain/General/UserProfileFactory'),

  ComicInfoDatabaseService: Symbol('Domain/Library/ComicInfoDatabaseService'),
  DBService: Symbol('Domain/General/DBService'),
  DownloadComicService: Symbol('Domain/Downloader/DownloadComicService'),
  FileService: Symbol('Domain/General/FileService'),
  SFComicSourceSiteService: Symbol('Infrastructure/shared/SFComicSourceSiteService'),

  CollectionService: Symbol('Domain/Comic/CollectionService'),
  DownloadTaskRepository: Symbol('Domain/Downloader/DownloadTaskRepository'),
  UserProfileRepository: Symbol('Domain/General/UserProfileRepository'),
  ComicInfoRepository: Symbol('Domain/Library/ComicInfoRepository'),

  DBAdapter: Symbol('Domain/General/DBAdapter'),
  FileAdapter: Symbol('Domain/General/FileAdapter'),
  NetAdapter: Symbol('Domain/General/NetAdapter'),
  TimeAdapter: Symbol('Domain/General/TimeAdapter'),
}
