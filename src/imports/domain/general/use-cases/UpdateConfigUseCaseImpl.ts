import {inject, injectable} from 'inversify'
import {Observable, of} from 'rxjs'
import {map, mapTo, tap} from 'rxjs/operators'

import generalTypes from '../generalTypes'
import {Request, Response} from '../../base-types'
import {ConfigFactory} from '../interfaces/factories'
import {ConfigRepository} from '../interfaces/repositories'
import {UpdateConfigUseCase} from '../interfaces/use-cases'
import Config from '../entities/Config'

@injectable()
export default class UpdateConfigUseCaseImpl implements UpdateConfigUseCase {
  private readonly _configFactory: ConfigFactory
  private readonly _configRepository: ConfigRepository

  public constructor(
    @inject(generalTypes.ConfigFactory) configFactory: ConfigFactory,
    @inject(generalTypes.ConfigRepository) configRepository: ConfigRepository,
  ) {
    this._configFactory = configFactory
    this._configRepository = configRepository
  }

  execute = (request: Request): Observable<Response> => {
    return this._createRawConfigDataStream(request).pipe(
      this._createConfigFromJsonDataOpr(),
      this._saveConfigToRepositoryOpr(),
      this._returnEmptyResponseOpr(),
    )
  }

  private _createRawConfigDataStream = (request: Request): Observable<{ downloadFolderPath: string, comicInfoDatabasePath: string }> => {
    const rawConfigData: {
      downloadFolderPath: string,
      comicInfoDatabasePath: string,
    } = request.data

    return of(rawConfigData)
  }

  private _createConfigFromJsonDataOpr = () => (source: Observable<{ downloadFolderPath: string, comicInfoDatabasePath: string }>): Observable<Config> => {
    return source.pipe(
      map(this._configFactory.createFromJson),
    )
  }

  private _saveConfigToRepositoryOpr = () => (source: Observable<Config>): Observable<Config> => {
    return source.pipe(
      tap(async (config) => {
        await this._configRepository.asyncSaveOrUpdate(config)
      }),
    )
  }

  private _returnEmptyResponseOpr = () => (source: Observable<any>): Observable<Response> => {
    return source.pipe(
      mapTo(new Response()),
    )
  }
}
