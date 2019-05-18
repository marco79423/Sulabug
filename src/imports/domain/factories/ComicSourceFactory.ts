import 'reflect-metadata'

import {inject, injectable} from 'inversify'
import {IComicSourceFactory, IFileAdapter, INetAdapter} from '../interfaces'
import types from '../types'
import ComicSource from '../entities/ComicSource'


@injectable()
export default class ComicSourceFactory implements IComicSourceFactory {
  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter

  public constructor(
    @inject(types.NetAdapter) netAdapter: INetAdapter,
    @inject(types.FileAdapter) fileAdapter: IFileAdapter,
  ) {
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
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
      this._netAdapter,
      this._fileAdapter,
    )
  }
}


