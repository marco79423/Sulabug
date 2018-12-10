import * as fs from 'fs-extra'


export default class FileHandler {

  static async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    const exists = await this.asyncPathExists(targetPath)
    if (!exists) {
      return defaultJson
    }
    return await fs.readJSON(targetPath)
  }

  static async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await fs.writeJson(targetPath, targetPath)
  }

  static async asyncPathExists(targetPath: string): Promise<boolean> {
    return await fs.pathExists(targetPath)
  }
}
