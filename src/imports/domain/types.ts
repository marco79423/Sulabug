export default {
  EventPublisher: Symbol('Domain/Downloader/EventPublisher'),

  SFComicDownloadAdapter: Symbol('Domain/Downloader/SFComicDownloadAdapter'),

  ComicFactory: Symbol('Domain/Comic/ComicFactory'),
  ComicInfoFactory: Symbol('Domain/Library/ComicInfoFactory'),
  DownloadTaskFactory: Symbol('Domain/Downloader/DownloadTaskFactory'),
  UserProfileFactory: Symbol('Domain/General/UserProfileFactory'),

  ComicInfoDatabaseService: Symbol('Domain/Library/ComicInfoDatabaseService'),
  DBService: Symbol('Domain/General/DBService'),
  DownloadComicService: Symbol('Domain/Downloader/DownloadComicService'),
  FileService: Symbol('Domain/General/FileService'),
  NetService: Symbol('Domain/General/NetService'),

  ComicRepository: Symbol('Domain/Comic/ComicRepository'),
  DownloadTaskRepository: Symbol('Domain/Downloader/DownloadTaskRepository'),
  UserProfileRepository: Symbol('Domain/General/UserProfileRepository'),
  ComicInfoRepository: Symbol('Domain/Library/ComicInfoRepository'),

  DBAdapter: Symbol('Domain/General/DBAdapter'),
  FileAdapter: Symbol('Domain/General/FileAdapter'),
  NetAdapter: Symbol('Domain/General/NetAdapter'),
  SFComicInfoQueryAdapter: Symbol('Domain/Library/SFComicInfoQueryAdapter'),
}
