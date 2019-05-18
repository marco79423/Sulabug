export default {
  EventPublisher: Symbol('Domain/Downloader/EventPublisher'),

  ComicFactory: Symbol('Domain/Library/ComicFactory'),
  ComicSourceFactory: Symbol('Domain/Library/ComicSourceFactory'),
  DownloadTaskFactory: Symbol('Domain/Downloader/DownloadTaskFactory'),
  UserProfileFactory: Symbol('Domain/General/UserProfileFactory'),

  ComicDatabaseService: Symbol('Domain/Library/ComicDatabaseService'),
  DBService: Symbol('Domain/General/DBService'),
  DownloadComicService: Symbol('Domain/Downloader/DownloadComicService'),
  FileService: Symbol('Domain/General/FileService'),
  SFComicSourceSiteService: Symbol('Infrastructure/shared/SFComicSourceSiteService'),

  DownloadTaskRepository: Symbol('Domain/Downloader/DownloadTaskRepository'),
  UserProfileRepository: Symbol('Domain/General/UserProfileRepository'),
  ComicRepository: Symbol('Domain/Library/ComicRepository'),

  DBAdapter: Symbol('Domain/General/DBAdapter'),
  FileAdapter: Symbol('Domain/General/FileAdapter'),
  NetAdapter: Symbol('Domain/General/NetAdapter'),
  TimeAdapter: Symbol('Domain/General/TimeAdapter'),
}
