import {injectable} from 'inversify'

import {NetAdapter} from '../../../../domain/core/interfaces/adapters'
import NetHandler from '../../../general/base/NetHandler'

@injectable()
export default class NetAdapterImpl implements NetAdapter {

  async asyncGetText(targetUrl: string): Promise<string> {
    return await NetHandler.asyncGetText(targetUrl)
  }

  async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    return await NetHandler.asyncGetBinaryBase64(targetUrl)
  }
}
