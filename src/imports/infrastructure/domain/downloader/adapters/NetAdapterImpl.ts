import {inject, injectable} from 'inversify'

import generalTypes from '../../../general/generalTypes'
import {NetHandler} from '../../../general/interfaces/bases'
import {NetAdapter} from '../../../../domain/downloader/interfaces/adapters'

@injectable()
export default class NetAdapterImpl implements NetAdapter {
  private readonly _netHandler: NetHandler

  public constructor(
    @inject(generalTypes.NetHandler) netHandler: NetHandler,
  ) {
    this._netHandler = netHandler
  }

  async asyncGetText(targetUrl: string): Promise<string> {
    return await this._netHandler.asyncGetText(targetUrl)
  }

  async asyncDownload(targetUrl: string, targetPath: string): Promise<void> {
    await this._netHandler.asyncDownload(targetUrl, targetPath)
  }
}
