import {inject, injectable} from 'inversify'

import {INetAdapter, INetService} from '../interfaces'
import generalTypes from '../generalTypes'


@injectable()
export default class NetService implements INetService {
  private readonly _netAdapter: INetAdapter

  public constructor(
    @inject(generalTypes.NetAdapter) netAdapter: INetAdapter,
  ) {
    this._netAdapter = netAdapter
  }

  async asyncGetText(targetUrl: string): Promise<string> {
    return await this._netAdapter.asyncGetText(targetUrl)
  }

  async asyncDownload(targetUrl: string, targetPath: string): Promise<void> {
    return await this._netAdapter.asyncDownload(targetUrl, targetPath)
  }

  async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    return await this._netAdapter.asyncGetBinaryBase64(targetUrl)
  }
}
