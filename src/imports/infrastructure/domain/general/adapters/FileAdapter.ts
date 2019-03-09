import {injectable} from 'inversify'
import * as fs from 'fs-extra'

import {IFileAdapter} from '../../../../domain/general/interfaces'

@injectable()
export default class FileAdapter implements IFileAdapter {

  async asyncEnsureDir(targetDirPath: string): Promise<void> {
    await fs.ensureDir(targetDirPath)
  }

  async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    const exists = await this.asyncPathExists(targetPath)
    if (!exists) {
      return defaultJson
    }
    return await fs.readJSON(targetPath)
  }

  async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await fs.writeJson(targetPath, data)
  }

  async asyncPathExists(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath)
  }
}
