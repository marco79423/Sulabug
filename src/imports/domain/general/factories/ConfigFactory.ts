import {injectable} from 'inversify'

import Config from '../entities/Config'
import {IConfigFactory} from '../interfaces'

@injectable()
export default class ConfigFactory implements IConfigFactory {

  createFromJson(json: {
    downloadFolderPath: string,
  }): Config {
    return new Config(
      json.downloadFolderPath,
    )
  }
}
