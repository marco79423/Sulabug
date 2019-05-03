import {inject, injectable} from 'inversify'

import {ICollectionService, IComicRepository, IFileAdapter, IUserProfileRepository} from '../interfaces'
import types from '../types'
import Comic from '../entities/Comic'
import * as path from 'path'

@injectable()
export default class CollectionService implements ICollectionService {
  private readonly _fileAdapter: IFileAdapter
  private readonly _comicRepository: IComicRepository
  private readonly _userProfileRepository: IUserProfileRepository

  public constructor(
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
    @inject(types.ComicRepository) comicRepository: IComicRepository,
    @inject(types.UserProfileRepository) userProfileRepository: IUserProfileRepository,
  ) {
    this._fileAdapter = fileAdapter
    this._comicRepository = comicRepository
    this._userProfileRepository = userProfileRepository
  }

  asyncAddComicToCollection = async (id: string): Promise<void> => {
    const comic = await this._comicRepository.asyncGetById(id)

    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    const targetComicFolderPath = path.join(downloadFolderPath, comic.name)
    await this._fileAdapter.asyncEnsureDir(targetComicFolderPath)
    await this._fileAdapter.asyncWriteJson(path.join(targetComicFolderPath, '.comic'), {id: comic.id})
  }

  asyncGetAllComicsFromCollection = async (): Promise<Comic[]> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    await this._fileAdapter.asyncEnsureDir(downloadFolderPath)
    const possibleComicFolderPaths = await this._fileAdapter.asyncListFolder(downloadFolderPath)

    const comics: Comic[] = []
    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta: { id: string } = await this._fileAdapter.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta == null) {
        continue
      }

      const comic = await this._comicRepository.asyncGetById(comicMeta.id)
      comics.push(comic)
    }

    return comics
  }

  asyncCheckCollection = async (id: string): Promise<boolean> => {
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()

    await this._fileAdapter.asyncEnsureDir(downloadFolderPath)
    const possibleComicFolderPaths = await this._fileAdapter.asyncListFolder(downloadFolderPath)

    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta: { id: string } = await this._fileAdapter.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta == null) {
        continue
      }

      if (id === comicMeta.id) {
        return true
      }
    }

    return false
  }

  asyncRemoveComicFromCollection = async (id: string): Promise<void> => {
    const comic = await this._comicRepository.asyncGetById(id)
    const downloadFolderPath = await this._asyncGetDownloadFolderPath()
    await this._fileAdapter.asyncRemove(path.join(downloadFolderPath, comic.name))
  }

  private async _asyncGetDownloadFolderPath() {
    const userProfile = await this._userProfileRepository.asyncGet()
    return userProfile.downloadFolderPath
  }
}
