import {inject, injectable} from 'inversify'

import {ICollectionService, IComicInfoRepository, IFileAdapter, IUserProfileRepository} from '../interfaces'
import types from '../types'
import ComicInfo from '../entities/ComicInfo'
import * as path from 'path'

@injectable()
export default class CollectionService implements ICollectionService {
  private readonly _fileAdapter: IFileAdapter
  private readonly _comicInfoRepository: IComicInfoRepository
  private readonly _userProfileRepository: IUserProfileRepository

  public constructor(
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
    @inject(types.ComicInfoRepository) comicInfoRepository: IComicInfoRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
  ) {
    this._fileAdapter = fileAdapter
    this._comicInfoRepository = comicInfoRepository
    this._userProfileRepository = userProfileRepository
  }

  asyncAddComicToCollection = async (identity: string): Promise<void> => {
    const comicInfo = await this._comicInfoRepository.asyncGetById(identity)

    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const targetComicFolderPath = path.join(downloadFolderPath, comicInfo.name)
    await this._fileAdapter.asyncEnsureDir(targetComicFolderPath)
    await this._fileAdapter.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: comicInfo.identity})
  }

  asyncGetAllComicsFromCollection = async (): Promise<ComicInfo[]> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    await this._fileAdapter.asyncEnsureDir(downloadFolderPath)
    const possibleComicFolderPaths = await this._fileAdapter.asyncListFolder(downloadFolderPath)

    const comics: ComicInfo[] = []
    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta: { id: string } = await this._fileAdapter.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta == null) {
        continue
      }

      const comic = await this._comicInfoRepository.asyncGetById(comicMeta.id)
      comics.push(comic)
    }

    return comics
  }

  asyncCheckCollection = async (identity: string): Promise<boolean> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    await this._fileAdapter.asyncEnsureDir(downloadFolderPath)
    const possibleComicFolderPaths = await this._fileAdapter.asyncListFolder(downloadFolderPath)

    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta: { id: string } = await this._fileAdapter.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta == null) {
        continue
      }

      if (identity === comicMeta.id) {
        return true
      }
    }

    return false
  }

  asyncRemoveComicFromCollection = async (identity: string): Promise<void> => {
    const comicInfo = await this._comicInfoRepository.asyncGetById(identity)
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()
    await this._fileAdapter.asyncRemove(path.join(downloadFolderPath, comicInfo.name))
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
