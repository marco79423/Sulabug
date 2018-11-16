import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {AsyncUseCase, Request, Response, ResponseError} from '../../base-types'
import {ConfigFactory} from '../interfaces/factories'
import {ConfigRepository} from '../interfaces/repositories'

@injectable()
export default class UpdateConfigUseCase implements AsyncUseCase {
  private readonly _configFactory: ConfigFactory
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(coreTypes.ConfigFactory) configFactory: ConfigFactory,
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository,
  ) {
    this._configFactory = configFactory
    this._configRepository = configRepository
  }

  asyncExecute = async (request: Request): Promise<Response | ResponseError> => {
    const rawConfigData: {
      comicsFolder: string,
      comicInfoStorePath: string,
    } = request.data

    const config = this._configFactory.createFromJson(rawConfigData)
    await this._configRepository.asyncSaveOrUpdate(config)
    return new Response()
  }
}
