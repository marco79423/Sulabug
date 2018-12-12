import {inject, injectable} from 'inversify'

import generalTypes from '../generalTypes'
import {Response} from '../../base-types'
import {ConfigRepository} from '../interfaces/repositories'
import {QueryConfigUseCase} from '../interfaces/use-cases'

@injectable()
export default class QueryConfigUseCaseImpl implements QueryConfigUseCase {
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(generalTypes.ConfigRepository) configRepository: ConfigRepository
  ) {
    this._configRepository = configRepository
  }

  async asyncExecute(): Promise<Response> {
    const config = await this._configRepository.asyncGet()
    return new Response(config.serialize())
  }
}
