import * as os from 'os'
import * as path from 'path'
import {IPathAdapter} from '../interface'

export class PathAdapter implements IPathAdapter {
  public getHomeDir(): string {
    return os.homedir()
  }

  public joinPaths(...filepaths: string[]): string {
    return path.join(...filepaths)
  }

  public convertToAbsolutePath(filepath: string): string {
    return path.resolve(filepath)
  }

  public pathToFileUrl(filePath: string): string {
    return require('file-url')(filePath)
  }
}
