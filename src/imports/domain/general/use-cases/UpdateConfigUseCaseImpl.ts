import {Observable} from 'rxjs'
import {inject, injectable} from 'inversify'

import generalTypes from '../generalTypes'
import {Request, Response} from '../../base-types'
import {ConfigFactory} from '../interfaces/factories'
import {ConfigRepository} from '../interfaces/repositories'
import {UpdateConfigUseCase} from '../interfaces/use-cases'

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

  execute(request: Request): Observable<Response> {
    const rawConfigData: {
      downloadFolderPath: string,
      comicInfoDatabasePath: string,
    } = request.data

    return Observable.create(async (observer) => {
      const config = this._configFactory.createFromJson(rawConfigData)
      await this._configRepository.asyncSaveOrUpdate(config)
      observer.next(new Response())
      observer.complete()
    })
  }
}
