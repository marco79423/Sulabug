import * as fs from 'fs-extra'
import fetch from 'node-fetch'

export default class NetHandler {

  static async asyncGetText(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    return await response.text()
  }

  static async asyncDownload(targetUrl: string, targetPath: string): Promise<void> {
    await fetch(targetUrl)
      .then(response => {
        const dest = fs.createWriteStream(targetPath)
        response.body.pipe(dest)
      })
  }

  static async asyncGetBinaryBase64(targetUrl: string): Promise<string> {
    const response = await fetch(targetUrl)
    const buffer = await response.arrayBuffer()
    return Buffer.from(buffer).toString('base64')
  }
}
