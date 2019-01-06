import {inject, injectable} from 'inversify'

import libraryTypes from '../../../../domain/library/libraryTypes'
import infraTypes from '../../../infraTypes'
import ComicInfo from '../../../../domain/library/entities/ComicInfo'
import Database from '../../../shared/interfaces/Database'
import {ComicInfoFactory} from '../../../../domain/library/interfaces/factories'
import {ComicInfoRepository} from '../../../../domain/library/interfaces/repositories'
import {ComicInfoCollection} from '../../../shared/database/collections'


@injectable()
export default class ComicInfoRepositoryImpl implements ComicInfoRepository {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _database: Database

  public constructor(
    @inject(libraryTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(infraTypes.Database) database: Database,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._database = database
  }

  asyncSaveOrUpdate = async (comicInfo: ComicInfo): Promise<void> => {
    await this._database.asyncSaveOrUpdate(ComicInfoCollection.name, comicInfo.serialize())
  }

  asyncGetById = async (identity: string): Promise<ComicInfo> => {
    const rawComicInfo = await this._database.asyncFindOne(ComicInfoCollection.name, {
      id: identity
    })
    if (!rawComicInfo) {
      throw new Error('Target comic info not found')
    }
    return this._comicInfoFactory.createFromJson(rawComicInfo)
  }

  asyncGetAllBySearchTerm = async (searchTerm: string = ''): Promise<ComicInfo[]> => {
    const rawComicInfos = await this._database.asyncFind(ComicInfoCollection.name, {
      name: {
        $regex: `.*${searchTerm}.*`,
      }
    })
    return rawComicInfos
      .map(rawComicInfo => this._comicInfoFactory.createFromJson(rawComicInfo))
  }
}
