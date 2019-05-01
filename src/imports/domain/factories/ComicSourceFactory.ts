import 'reflect-metadata'

import {inject, injectable} from 'inversify'
import {IComicSourceFactory, INetService} from '../interfaces'
import types from '../types'
import ComicSource from '../entities/ComicSource'


@injectable()
export default class ComicSourceFactory implements IComicSourceFactory {
  private readonly _netService: INetService

  public constructor(
    @inject(types.NetService) netService: INetService,
  ) {
    this._netService = netService
  }

  createFromJson(json: {
    id: string,
    name: string,
    source: string,
    pageUrl: string,
  }): ComicSource {
    return new ComicSource(
      json.id,
      json.name,
      json.source,
      json.pageUrl,
      this._netService
    )
  }
}


