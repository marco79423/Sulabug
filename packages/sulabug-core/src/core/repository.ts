import {IWebComicSource, IWebComicSourceRepository} from './interface'
import {DumpWebComicSource} from './source/dump'
import {SFWebComicSource} from './source/sfacg'

export class WebComicSourceRepository implements IWebComicSourceRepository {

  private readonly _sources: IWebComicSource[]

  constructor() {
    this._sources = [
      new DumpWebComicSource(),
      // new SFWebComicSource(),
    ]
  }

  get(code: string): IWebComicSource | null {
    for (const source of this._sources) {
      if (source.code === code) {
        return source
      }
    }

    return null
  }

  getAll(): IWebComicSource[] {
    return this._sources
  }
}