import {inject, injectable} from 'inversify'

import generalTypes from '../generalTypes'
import {Response} from '../../base-types'
import {ConfigRepository} from '../interfaces/repositories'
import {QueryConfigUseCase} from '../interfaces/use-cases'
import {Observable} from 'rxjs'


@injectable()
export default class QueryConfigUseCaseImpl implements QueryConfigUseCase {
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(generalTypes.ConfigRepository) configRepository: ConfigRepository
  ) {
    this._configRepository = configRepository
  }

  execute(): Observable<Response> {
    return Observable.create(async (observer) => {
      const config = await this._configRepository.asyncGet()
      observer.next(new Response(config.serialize()))
      observer.complete()
    })
  }
}
