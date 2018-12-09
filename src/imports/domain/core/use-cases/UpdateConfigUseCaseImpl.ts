import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {Request, Response} from '../../base-types'
import {ConfigFactory} from '../interfaces/factories'
import {ConfigRepository} from '../interfaces/repositories'
import {UpdateConfigUseCase} from '../interfaces/use-cases'

@injectable()
export default class UpdateConfigUseCaseImpl implements UpdateConfigUseCase {
  private readonly _configFactory: ConfigFactory
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(coreTypes.ConfigFactory) configFactory: ConfigFactory,
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository,
  ) {
    this._configFactory = configFactory
    this._configRepository = configRepository
  }

  async asyncExecute(request: Request): Promise<Response> {
    const rawConfigData: {
      downloadFolderPath: string,
      comicInfoDatabasePath: string,
    } = request.data

    const config = this._configFactory.createFromJson(rawConfigData)
    await this._configRepository.asyncSaveOrUpdate(config)
    return new Response()
  }
}
