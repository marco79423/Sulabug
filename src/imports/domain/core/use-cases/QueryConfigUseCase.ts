import {inject, injectable} from 'inversify'

import coreTypes from '../coreTypes'
import {AsyncUseCase, Response, ResponseError} from '../../base-types'
import {ConfigRepository} from '../interfaces/repositories'

@injectable()
export default class QueryConfigUseCase implements AsyncUseCase {
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(coreTypes.ConfigRepository) configRepository: ConfigRepository
  ) {
    this._configRepository = configRepository
  }

  asyncExecute = async (): Promise<Response | ResponseError> => {
    const config = await this._configRepository.asyncGet()
    return new Response(config.serialize())
  }
}
