import {injectable} from 'inversify'

import Config from '../entities/Config'
import {ConfigFactory} from '../interfaces'

@injectable()
export default class ConfigFactoryImpl implements ConfigFactory {

  createFromJson(json: {
    downloadFolderPath: string,
  }): Config {
    return new Config(
      json.downloadFolderPath,
    )
  }
}
