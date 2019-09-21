import * as fs from 'fs-extra'
import * as path from 'path'
import {IFileAdapter} from '../interface'

export default class FileAdapter implements IFileAdapter {

  async ensureDir(targetDirPath: string): Promise<void> {
    await fs.ensureDir(targetDirPath)
  }

  async readJson(targetPath: string, defaultJson: any = null): Promise<any> {
    const exists = await this.pathExists(targetPath)
    if (!exists) {
      return defaultJson
    }
    return await fs.readJSON(targetPath)
  }

  async writeJson(targetPath: string, json: any): Promise<void> {
    await fs.writeJson(targetPath, json)
  }

  async pathExists(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath)
  }

  async listFolder(targetPath: string): Promise<string[]> {
    return fs.readdir(targetPath)
      .then(filenames => filenames.map(filename => path.join(targetPath, filename)))
  }

  async remove(targetPath: string): Promise<void> {
    await fs.remove(targetPath)
  }
}
