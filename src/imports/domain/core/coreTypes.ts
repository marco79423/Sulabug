export default {
  FileAdapter: Symbol('Core/FileAdapter'),
  NetAdapter: Symbol('Core/NetAdapter'),

  ComicInfoFactory: Symbol('Core/ComicInfoFactory'),
  ConfigFactory: Symbol('Core/ConfigFactory'),

  ComicInfoStorageRepository: Symbol('Core/ComicInfoStorageRepository'),
  ConfigRepository: Symbol('Core/ConfigRepository'),

  SFComicSiteService: Symbol('Core/SFComicSiteService'),

  QueryComicInfoByIdentityFromDatabaseUseCase: Symbol('Core/QueryComicInfoByIdentityFromDatabaseUseCase'),
  QueryComicInfosFromDatabaseUseCase: Symbol('Core/QueryComicInfosFromDatabaseUseCase'),
  QueryConfigUseCase: Symbol('Core/QueryConfigUseCase'),
  UpdateComicInfoDatabaseUseCase: Symbol('Core/UpdateComicInfoDatabaseUseCase'),
  UpdateConfigUseCase: Symbol('Core/UpdateConfigUseCase'),
}
