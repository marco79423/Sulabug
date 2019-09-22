import * as os from 'os'
import * as path from 'path'
import {IPathAdapter} from '../interface'

export class PathAdapter implements IPathAdapter {
  public getHomeDir(): string {
    return os.homedir()
  }

  public joinPaths(...paths: string[]): string {
    return path.join(...paths)
  }

  public pathToFileUrl(filePath: string): string {
    return require('file-url')(filePath)
  }
}
