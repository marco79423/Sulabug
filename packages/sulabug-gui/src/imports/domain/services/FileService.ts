import {inject, injectable} from 'inversify'

import {IFileAdapter, IFileService} from '../interfaces'
import types from '../types'

@injectable()
export default class FileService implements IFileService {
  private readonly _fileAdapter: IFileAdapter

  public constructor(
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
  ) {
    this._fileAdapter = fileAdapter
  }

  async asyncEnsureDir(targetDirPath: string): Promise<void> {
    await this._fileAdapter.asyncEnsureDir(targetDirPath)
  }

  async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    return await this._fileAdapter.asyncReadJson(targetPath, defaultJson)
  }

  async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await this._fileAdapter.asyncWriteJson(targetPath, data)
  }

  async asyncPathExists(targetPath: string): Promise<boolean> {
    return this._fileAdapter.asyncPathExists(targetPath)
  }

  async asyncListFolder(targetPath: string): Promise<string[]> {
    return this._fileAdapter.asyncListFolder(targetPath)
  }

  async asyncRemove(targetPath: string): Promise<void> {
    this._fileAdapter.asyncRemove(targetPath)
  }
}
