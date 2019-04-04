import {inject, injectable} from 'inversify'

import libraryTypes from '../../../domain/types'
import infraTypes from '../../infraTypes'
import {IComicInfoFactory, ISFComicInfoQueryAdapter} from '../../../domain/interfaces'
import ComicInfo from '../../../domain/entities/ComicInfo'
import {ISFSourceSite} from '../../shared/interfaces'

@injectable()
export default class SFComicInfoQueryAdapter implements ISFComicInfoQueryAdapter {
  private readonly _comicInfoFactory: IComicInfoFactory
  private readonly _sfSourceSite: ISFSourceSite

  public constructor(
    @inject(libraryTypes.ComicInfoFactory) comicInfoFactory: IComicInfoFactory,
    @inject(infraTypes.SFSourceSite) sfSourceSite: ISFSourceSite,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._sfSourceSite = sfSourceSite
  }

  asyncQueryComicInfos = async (): Promise<ComicInfo[]> => {
    const rawComicInfos = await this._sfSourceSite.asyncQueryComicInfos()
    return rawComicInfos.map(rawComicInfo => this._comicInfoFactory.createFromJson({
      id: rawComicInfo.name,
      name: rawComicInfo.name,
      coverDataUrl: rawComicInfo.coverDataUrl,
      source: 'SF',
      pageUrl: rawComicInfo.pageUrl,
      catalog: rawComicInfo.catalog,
      author: rawComicInfo.author,
      lastUpdatedChapter: rawComicInfo.lastUpdatedChapter,
      lastUpdatedTime: rawComicInfo.lastUpdatedTime.toISOString(),
      summary: rawComicInfo.summary,
      chapters: rawComicInfo.chapters,
    }))
  }
}