import Config from '../entities/Config'

export interface ConfigRepository {

  asyncSaveOrUpdate(config: Config): Promise<void>

  asyncGet(): Promise<Config>
}
