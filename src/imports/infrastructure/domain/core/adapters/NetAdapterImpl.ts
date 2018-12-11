import {inject, injectable} from 'inversify'

import {NetAdapter} from '../../../../domain/core/interfaces/adapters'
import {NetHandler} from '../../../general/interfaces/bases'
import generalTypes from '../../../general/generalTypes'

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

  async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    return await this._netHandler.asyncGetBinaryBase64(targetUrl)
  }
}
