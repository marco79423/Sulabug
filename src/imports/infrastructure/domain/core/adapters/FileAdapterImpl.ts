import {injectable} from 'inversify'

import {FileAdapter} from '../../../../domain/core/interfaces/adapters'
import FileHandler from '../../../general/base/FileHandler'

@injectable()
export default class FileAdapterImpl implements FileAdapter {

  async asyncReadJson(targetPath: string, defaultJson: any = null): Promise<any> {
    return await FileHandler.asyncReadJson(targetPath, defaultJson)
  }

  async asyncWriteJson(targetPath: string, data: any): Promise<void> {
    await FileHandler.asyncWriteJson(targetPath, data)
  }

  async asyncPathExists(targetPath: string): Promise<boolean> {
    return await FileHandler.asyncPathExists(targetPath)
  }
}
