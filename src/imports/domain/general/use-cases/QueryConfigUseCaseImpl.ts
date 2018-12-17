import {inject, injectable} from 'inversify'
import {from, Observable, timer} from 'rxjs'
import {map, mergeMap} from 'rxjs/operators'

import generalTypes from '../generalTypes'
import {Response} from '../../base-types'
import {ConfigRepository} from '../interfaces/repositories'
import {QueryConfigUseCase} from '../interfaces/use-cases'
import Config from '../entities/Config'


@injectable()
export default class QueryConfigUseCaseImpl implements QueryConfigUseCase {
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(generalTypes.ConfigRepository) configRepository: ConfigRepository
  ) {
    this._configRepository = configRepository
  }

  execute = (): Observable<Response> => {
    return this._createStream().pipe(
      this._queryConfigOpr(),
      this._returnResponseWithConfigOpr(),
    )
  }

  private _createStream = (): Observable<any> => {
    return timer(0)
  }

  private _queryConfigOpr = () => (source: Observable<any>): Observable<Config> => {
    return source.pipe(
      mergeMap(() => from(this._configRepository.asyncGet())),
    )
  }

  private _returnResponseWithConfigOpr = () => (source: Observable<Config>): Observable<Response> => {
    return source.pipe(
      map(config => new Response(config.serialize())),
    )
  }
}
