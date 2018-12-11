import * as fs from 'fs-extra'
import {inject, injectable} from 'inversify'

import coreTypes from '../../../../domain/core/coreTypes'
import generalTypes from '../../../general/generalTypes'
import ComicInfo from '../../../../domain/core/entities/ComicInfo'
import {ComicInfoFactory} from '../../../../domain/core/interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository} from '../../../../domain/core/interfaces/repositories'
import {FileHandler} from '../../../general/interfaces/bases'

@injectable()
export default class ComicInfoStorageRepositoryImpl implements ComicInfoStorageRepository {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _configRepository: ConfigRepository
  private readonly _fileHandler: FileHandler

  public constructor(
    @inject(coreTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository,
    @inject(generalTypes.FileHandler) fileHandler: FileHandler,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._configRepository = configRepository
    this._fileHandler = fileHandler
  }

  async asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    rawComicInfos[comicInfo.identity] = comicInfo.serialize()
    await fs.writeJson(config.comicInfoDatabasePath, rawComicInfos)
  }

  async asyncGetById(identity: string): Promise<ComicInfo | null> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    const rawComicInfo = rawComicInfos[identity]
    if (!rawComicInfo) {
      return null
    }
    return this._comicInfoFactory.createFromJson(rawComicInfo)
  }

  async asyncGetAllBySearchTerm(searchTerm: string = ''): Promise<ComicInfo[]> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileHandler.asyncReadJson(config.comicInfoDatabasePath, {})
    return Object.keys(rawComicInfos)
      .map(id => this._comicInfoFactory.createFromJson(rawComicInfos[id]))
      .filter(comicInfo => !searchTerm || comicInfo.name.includes(searchTerm))
  }
}
