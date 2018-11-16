import {injectable} from 'inversify'

import Config from '../entities/Config'
import {ConfigFactory} from '../interfaces/factories'

@injectable()
export default class ConfigFactoryImpl implements ConfigFactory {

  createFromJson(json: {
    comicsFolder: string,
    comicInfoStorePath: string,
  }): Config {
    return new Config(
      json.comicsFolder,
      json.comicInfoStorePath,
    )
  }
}
