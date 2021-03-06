import {inject, injectable} from 'inversify'

import libraryTypes from '../../../domain/types'
import infraTypes from '../../infraTypes'
import Comic from '../../../domain/entities/Comic'
import IDatabase from '../../shared/interfaces'
import {IComicFactory, IComicRepository} from '../../../domain/interfaces'


@injectable()
export default class ComicRepository implements IComicRepository {
  private readonly _comicFactory: IComicFactory
  private readonly _database: IDatabase

  public constructor(
    @inject(libraryTypes.ComicFactory) comicFactory: IComicFactory,
    @inject(infraTypes.Database) database: IDatabase,
  ) {
    this._comicFactory = comicFactory
    this._database = database
  }

  asyncSaveOrUpdate = async (comic: Comic): Promise<void> => {
    await this._database.asyncSaveOrUpdate('comic', comic.serialize())
  }

  asyncGetById = async (id: string): Promise<Comic | null> => {
    const rawComic = await this._database.asyncFindOne('comic', {
      id: id
    })
    if (!rawComic) {
      return null
    }
    return this._comicFactory.createFromJson(rawComic)
  }

  asyncGetAllBySearchTerm = async (searchTerm: string = ''): Promise<Comic[]> => {
    const rawComics = await this._database.asyncFind('comic', {
      name: {
        $regex: `.*${searchTerm}.*`,
      }
    })
    return rawComics
      .map(rawComic => this._comicFactory.createFromJson(rawComic))
  }
}
