import * as crypto from 'crypto'
import {IHashAdapter} from '../interface'

export class HashAdapter implements IHashAdapter {
  async encodeWithMD5(source: string | Buffer): Promise<string> {
    const md5 = crypto.createHash('md5')
    return md5.update(source).digest('hex')
  }
}
