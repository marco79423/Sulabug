import {IWebComicSource, IWebComicSourceRepository} from '../interface'

export class WebComicSourceRepository implements IWebComicSourceRepository {
  private readonly _webComicSources: IWebComicSource[]

  constructor(webComicSources: IWebComicSource[]) {
    this._webComicSources = webComicSources
  }

  get(code: string): IWebComicSource | null {
    for (const webComicSource of this._webComicSources) {
      if (webComicSource.code === code) {
        return webComicSource
      }
    }

    return null
  }

  getAll(): IWebComicSource[] {
    return this._webComicSources
  }
}