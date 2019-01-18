import {inject, injectable} from 'inversify'

import {IComicInfoQueryService, ISFComicInfoQueryAdapter} from '../interfaces'
import ComicInfo from '../entities/ComicInfo'
import libraryTypes from '../libraryTypes'


@injectable()
export default class ComicInfoQueryService implements IComicInfoQueryService {
  private readonly _sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter

  constructor(
    @inject(libraryTypes.SFComicInfoQueryAdapter) sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter
  ) {
    this._sfComicInfoQueryAdapter = sfComicInfoQueryAdapter
  }

  asyncQueryComicInfos = (): Promise<ComicInfo[]> => {
    return this._sfComicInfoQueryAdapter.asyncQueryComicInfos()
  }
}
