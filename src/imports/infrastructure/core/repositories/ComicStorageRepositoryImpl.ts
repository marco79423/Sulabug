import * as fs from 'fs-extra'
import {inject, injectable} from 'inversify'

import coreTypes from '../../../domain/core/coreTypes'
import ComicInfo from '../../../domain/core/entities/ComicInfo'
import {ComicInfoFactory} from '../../../domain/core/interfaces/factories'
import {ComicInfoStorageRepository, ConfigRepository} from '../../../domain/core/interfaces/repositories'
import {FileAdapter} from '../../../domain/core/interfaces/adapters'

@injectable()
export default class ComicInfoStorageRepositoryImpl implements ComicInfoStorageRepository {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _fileAdapter: FileAdapter
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(coreTypes.FileAdapter) fileAdapter: FileAdapter,
    @inject(coreTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository,
  ) {
    this._fileAdapter = fileAdapter
    this._comicInfoFactory = comicInfoFactory
    this._configRepository = configRepository
  }

  async asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileAdapter.asyncReadJson(config.comicInfoStorePath, {})
    rawComicInfos[comicInfo.identity] = comicInfo.serialize()
    await fs.writeJson(config.comicInfoStorePath, rawComicInfos)
  }

  async asyncGetById(identity: string): Promise<ComicInfo | null> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileAdapter.asyncReadJson(config.comicInfoStorePath, {})
    const rawComicInfo = rawComicInfos[identity]
    if (!rawComicInfo) {
      return null
    }
    return this._comicInfoFactory.createFromJson(rawComicInfo)
  }

  async asyncGetAllBySearchTerm(searchTerm: string = ''): Promise<ComicInfo[]> {
    const config = await this._configRepository.asyncGet()
    const rawComicInfos = await this._fileAdapter.asyncReadJson(config.comicInfoStorePath, {})
    return Object.keys(rawComicInfos)
      .map(id => this._comicInfoFactory.createFromJson(rawComicInfos[id]))
      .filter(comicInfo => !searchTerm || comicInfo.name.includes(searchTerm))
  }
}
