import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import coreTypes from '../coreTypes'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../interfaces/use-cases'
import {NetAdapter} from '../interfaces/adapters'


@injectable()
export default class FetchHtmlUseCaseImpl implements QueryComicInfoByIdentityFromDatabaseUseCase {
  private readonly _netAdapter: NetAdapter

  public constructor(
    @inject(coreTypes.NetAdapter) netAdapter: NetAdapter,
  ) {
    this._netAdapter = netAdapter
  }

  async asyncExecute(request: Request): Promise<Response> {
    const targetUrl: string = request.data
    const text = await this._netAdapter.asyncGetText(targetUrl)
    return new Response(text)
  }
}
