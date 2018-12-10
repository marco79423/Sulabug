import {injectable} from 'inversify'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'

import {NetAdapter} from '../../../../domain/core/interfaces/adapters'

@injectable()
export default class NetAdapterImpl implements NetAdapter {

  async asyncGetText(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    return await response.text()
  }

  async asyncDownload(targetUrl: string, targetPath: string): Promise<void> {
    await fetch(targetUrl)
      .then(response => {
        const dest = fs.createWriteStream(targetPath)
        response.body.pipe(dest)
      })
  }

  async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  }
}
