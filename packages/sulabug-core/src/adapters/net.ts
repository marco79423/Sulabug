import axios from 'axios'
import * as fs from 'fs-extra'
import {INetAdapter} from '../interface'


const sleep = (m: number) => new Promise(r => setTimeout(r, m))


export class NetAdapter implements INetAdapter {

  async fetchJson(targetUrl: string): Promise<any> {
    try {
      const response = await axios.get(targetUrl)
      return await response.data
    } catch (e) {
      await sleep(5000)
      return await this.fetchJson(targetUrl)
    }
  }

  async fetchText(targetUrl: string): Promise<string> {
    try {
      const response = await axios.get(targetUrl, {
        responseType: 'document',
      })
      return await response.data
    } catch (e) {
      await sleep(5000)
      return await this.fetchText(targetUrl)
    }
  }

  async fetchBinaryData(targetUrl: string): Promise<Buffer> {
    try {
      const response = await axios.get(targetUrl, {
        responseType: 'arraybuffer',
      })
      return Buffer.from(response.data)
    } catch (e) {
      await sleep(5000)
      return await this.fetchBinaryData(targetUrl)
    }
  }

  async downloadFile(targetUrl: string, targetPath: string) {
    try {
      const res = await axios.get(targetUrl, {responseType: 'stream'})
      await new Promise(resolve => {
        res.data.pipe(fs.createWriteStream(targetPath))
        res.data.on('end', () => {
          resolve()
        })
      })
    } catch (e) {
      await sleep(5000)
      await this.downloadFile(targetUrl, targetPath)
    }
  }
}
