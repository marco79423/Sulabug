import {injectable} from 'inversify'
import * as fs from 'fs-extra'
import * as path from 'path'

import {IFileAdapter} from '../../../domain/interfaces'

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

  async asyncListFolder(targetPath: string): Promise<string[]> {
    return fs.readdir(targetPath)
      .then(filenames => filenames.map(filename => path.join(targetPath, filename)))
  }

  async asyncRemove(targetPath: string): Promise<void> {
    await fs.remove(targetPath)
  }
}
