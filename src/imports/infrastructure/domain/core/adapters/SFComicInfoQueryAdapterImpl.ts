import {inject, injectable} from 'inversify'

import coreTypes from '../../../../domain/core/coreTypes'
import generalTypes from '../../../general/generalTypes'
import {SFComicInfoQueryAdapter} from '../../../../domain/core/interfaces/adapters'
import ComicInfo from '../../../../domain/core/entities/ComicInfo'
import {SFSourceSite} from '../../../general/interfaces/source-sites'
import {ComicInfoFactory} from '../../../../domain/core/interfaces/factories'

@injectable()
export default class SFComicInfoQueryAdapterImpl implements SFComicInfoQueryAdapter {
  private readonly _comicInfoFactory: ComicInfoFactory
  private readonly _sfSourceSite: SFSourceSite

  public constructor(
    @inject(coreTypes.ComicInfoFactory) comicInfoFactory: ComicInfoFactory,
    @inject(generalTypes.SFSourceSite) sfSourceSite: SFSourceSite,
  ) {
    this._comicInfoFactory = comicInfoFactory
    this._sfSourceSite = sfSourceSite
  }

  async asyncGetComicInfos(): Promise<ComicInfo[]> {
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
