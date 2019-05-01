import 'reflect-metadata'

import {inject, injectable} from 'inversify'
import {IComicSourceFactory, INetAdapter} from '../interfaces'
import types from '../types'
import ComicSource from '../entities/ComicSource'


@injectable()
export default class ComicSourceFactory implements IComicSourceFactory {
  private readonly _netAdapter: INetAdapter

  public constructor(
    @inject(types.NetAdapter) netAdapter: INetAdapter,
  ) {
    this._netAdapter = netAdapter
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
      this._netAdapter
    )
  }
}


