import {injectable} from 'inversify'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'

import {INetHandler} from '../interfaces'

@injectable()
export default class NetHandlerImpl implements INetHandler {

  async asyncGetText(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    return await response.text()
  }

  async asyncDownload(targetUrl: string, targetPath: string): Promise<void> {
    const response = await fetch(targetUrl)
    response.body.pipe(fs.createWriteStream(targetPath))
    await new Promise((resolve, reject) => {
      response.body.on('end', () => {
        resolve()
      })

      response.body.on('error', () => {
        reject()
      })
    })
  }

  async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  }
}
