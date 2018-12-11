import {inject, injectable} from 'inversify'

import generalTypes from '../../../general/generalTypes'
import {FileAdapter} from '../../../../domain/core/interfaces/adapters'
import {FileHandler} from '../../../general/interfaces/bases'

@injectable()
export default class FileAdapterImpl implements FileAdapter {
  private readonly _fileHandler: FileHandler

  public constructor(
    @inject(generalTypes.FileHandler) fileHandler: FileHandler,
  ) {
    this._fileHandler = fileHandler
  }

  async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    return await this._fileHandler.asyncReadJson(targetPath, defaultJson)
  }

  async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await this._fileHandler.asyncWriteJson(targetPath, data)
  }

  async asyncPathExists(targetPath: string): Promise<boolean> {
    return await this._fileHandler.asyncPathExists(targetPath)
  }
}
