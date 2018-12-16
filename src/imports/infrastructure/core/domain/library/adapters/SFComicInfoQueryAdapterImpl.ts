import {inject, injectable} from 'inversify'

import libraryTypes from '../../../../../domain/library/libraryTypes'
import coreTypes from '../../../coreTypes'
import {SFComicInfoQueryAdapter} from '../../../../../domain/library/interfaces/adapters'
import ComicInfo from '../../../../../domain/library/entities/ComicInfo'
import {ComicInfoFactory} from '../../../../../domain/library/interfaces/factories'
import {SFSourceSite} from '../../../interfaces/source-sites'

@injectable()
export default class SFComicInfoQueryAdapterImpl implements SFComicInfoQueryAdapter {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _sfSourceSite: SFSourceSite

  public constructor(
    @inject(libraryTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(coreTypes.SFSourceSite) sfSourceSite: SFSourceSite,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._sfSourceSite = sfSourceSite
  }

  asyncGetComicInfos = async (): Promise<ComicInfo[]> => {
    const rawComicInfos = await this._sfSourceSite.asyncGetComicInfos()
    return rawComicInfos.map(rawComicInfo => this._comicInfoFactory.createFromJson({
      id: rawComicInfo.name,
      name: rawComicInfo.name,
      coverDataUrl: rawComicInfo.coverDataUrl,
      source: 'SF',
      pageUrl: rawComicInfo.pageUrl,
      catalog: rawComicInfo.catalog,
      author: rawComicInfo.author,
      lastUpdated: rawComicInfo.lastUpdated,
      summary: rawComicInfo.summary,
    }))
  }
}
