import {inject, injectable} from 'inversify'

import types from '../../../domain/types'
import {
  IComicFactory,
  IComicRepository,
  IComicInfoRepository,
  IFileAdapter,
  IUserProfileRepository
} from '../../../domain/interfaces'
import Comic from '../../../domain/entities/Comic'
import * as path from 'path'


@injectable()
export default class ComicRepository implements IComicRepository {
  private readonly _fileAdapter: IFileAdapter
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _userProfileRepository: IUserProfileRepository
  private readonly _comicFactory: IComicFactory

  public constructor(
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
    @inject(types.ComicFactory) comicFactory: IComicFactory,
  ) {
    this._fileAdapter = fileAdapter
    this._comicInfoRepository = comicInfoRepository
    this._userProfileRepository = userProfileRepository
    this._comicFactory = comicFactory
  }

  asyncSaveOrUpdate = async (comic: Comic): Promise<void> => {
    const comicInfo = await this._comicInfoRepository.asyncGetById(comic.comicInfoIdentity)

    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const targetComicFolderPath = path.join(downloadFolderPath, comicInfo.name)
    await this._fileAdapter.asyncEnsureDir(targetComicFolderPath)
    await this._fileAdapter.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: comicInfo.identity})
  }

  asyncGetById = async (identity: string): Promise<Comic | null> => {
    const comics = await this.asyncGetAll()
    for (const comic of comics) {
      if (comic.identity === identity) {
        return comic
      }
    }

    return null
  }

  asyncGetAll = async (): Promise<Comic[]> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    await this._fileAdapter.asyncEnsureDir(downloadFolderPath)
    const possibleComicFolderPaths = await this._fileAdapter.asyncListFolder(downloadFolderPath)

    const comics: Comic[] = []
    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta: { id: string } = await this._fileAdapter.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta == null) {
        continue
      }
      comics.push(this._comicFactory.createFromJson({comicInfoIdentity: comicMeta.id}))
    }

    return comics
  }

  asyncDelete = async (identity: string): Promise<void> => {
    const comic = await this.asyncGetById(identity)
    if (comic == null) {
      return
    }

    const comicInfo = await this._comicInfoRepository.asyncGetById(comic.comicInfoIdentity)

    const downloadFolderPath = await this._asyncGetDownloadFolderPath()
    await this._fileAdapter.asyncRemove(path.join(downloadFolderPath, comicInfo.name))
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
