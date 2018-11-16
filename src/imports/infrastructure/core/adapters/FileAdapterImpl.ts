import * as fs from 'fs-extra'
import {injectable} from 'inversify'

import {FileAdapter} from '../../../domain/core/interfaces/adapters'

@injectable()
export default class FileAdapterImpl implements FileAdapter {

  async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    const exists = await this.asyncPathExists(targetPath)
    if (!exists) {
      return defaultJson
    }
    return await fs.readJSON(targetPath)
  }

  async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await fs.writeJson(targetPath, targetPath)
  }

  async asyncPathExists(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath)
  }
}
