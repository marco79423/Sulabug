import {inject, injectable} from 'inversify'

import generalTypes from '../../../../../domain/general/generalTypes'
import libraryTypes from '../../../../../domain/library/libraryTypes'
import coreTypes from '../../../coreTypes'
import ComicInfo from '../../../../../domain/library/entities/ComicInfo'
import {ComicInfoFactory} from '../../../../../domain/library/interfaces/factories'
import {ComicInfoStorageRepository} from '../../../../../domain/library/interfaces/repositories'
import {ConfigRepository} from '../../../../../domain/general/interfaces/repositories'
import {FileHandler} from '../../../../vendor/interfaces/handlers'


@injectable()
export default class ComicInfoStorageRepositoryImpl implements ComicInfoStorageRepository {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _configRepository: ConfigRepository
  private readonly _fileHandler: FileHandler

  public constructor(
    @inject(libraryTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(generalTypes.ConfigRepository) configRepository: ConfigRepository,
    @inject(coreTypes.FileHandler) fileHandler: FileHandler,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._configRepository = configRepository
    this._fileHandler = fileHandler
  }

  asyncSaveOrUpdate = async (comicInfo: ComicInfo): Promise<void> => {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    rawComicInfos[comicInfo.identity] = comicInfo.serialize()
    await this._fileHandler.asyncWriteJson(config.comicInfoDatabasePath, rawComicInfos)
  }

  asyncGetById = async (identity: string): Promise<ComicInfo>  => {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    const rawComicInfo = rawComicInfos[identity]
    if (!rawComicInfo) {
      throw new Error('Target comic info not found')
    }
    return this._comicInfoFactory.createFromJson(rawComicInfo)
  }

  asyncGetAllBySearchTerm = async (searchTerm: string = ''): Promise<ComicInfo[]> => {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    return Object.keys(rawComicInfos)
      .map(id => this._comicInfoFactory.createFromJson(rawComicInfos[id]))
      .filter(comicInfo => !searchTerm || comicInfo.name.includes(searchTerm))
  }
}
