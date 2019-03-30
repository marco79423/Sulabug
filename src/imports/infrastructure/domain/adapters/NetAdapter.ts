import {injectable} from 'inversify'
import * as fs from 'fs-extra'
import fetch from 'node-fetch'
import {INetAdapter} from '../../../domain/interfaces'

const sleep = m => new Promise(r => setTimeout(r, m))

@injectable()
export default class NetAdapter implements INetAdapter {

  async asyncGetText(targetUrl: string): Promise<string> {
    try {
      const response = await fetch(targetUrl)
      return await response.text()
    } catch (e) {
      console.log('error: ', e)
      await sleep(5000)
      return await this.asyncGetText(targetUrl)
    }
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
