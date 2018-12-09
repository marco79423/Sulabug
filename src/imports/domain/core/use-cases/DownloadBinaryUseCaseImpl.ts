import {inject, injectable} from 'inversify'

import {Request, Response} from '../../base-types'
import coreTypes from '../coreTypes'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../interfaces/use-cases'
import {NetAdapter} from '../interfaces/adapters'


@injectable()
export default class DownloadBinaryUseCaseImpl implements QueryComicInfoByIdentityFromDatabaseUseCase {
  private readonly _netAdapter: NetAdapter

  public constructor(
    @inject(coreTypes.NetAdapter) netAdapter: NetAdapter,
  ) {
    this._netAdapter = netAdapter
  }

  async asyncExecute(request: Request): Promise<Response> {
    const {targetUrl, targetPath}: {
      targetUrl: string,
      targetPath: string
    } = request.data
    await this._netAdapter.asyncDownload(targetUrl, targetPath)
    return new Response()
  }
}
