import {ITaskStatus, IWebComic, IWebComicBlueprint, IWebComicChapter, IWebComicSource} from '../interface'
import {interval, Observable} from 'rxjs'
import {map, take} from 'rxjs/operators'

export class DumpWebComicSource implements IWebComicSource {
  public readonly code: string
  public readonly name: string

  constructor() {
    this.code = 'dump'
    this.name = '假漫畫來源'
  }

  public createWebComicByBlueprint(blueprint: any): IWebComic {
    const {name} = blueprint
    return new DumpWebComic(name, 'https://marco79423.net')
  }

  public collectAllWebComics(): Observable<ITaskStatus> {
    const total = 100
    const results: IWebComic[] = []
    for (let i = 0; i < total; i++) {
      results.push(this.createWebComicByBlueprint({name: `漫畫 ${i}`}))
    }

    return interval(10).pipe(
      take(total),
      map(i => i + 1),
      map(current => ({
        result: current === total ? results : undefined,
        changed: results.slice(current - 1, current),
        completed: current === total,
        progress: {
          current,
          total,
          status: `現在狀態是 ${current}`,
        }
      }))
    )
  }
}

export class DumpWebComic implements IWebComic {
  readonly name: string
  readonly source: string
  readonly sourcePageUrl: string
  readonly blueprint: IWebComicBlueprint

  constructor(name: string, sourcePageUrl: string) {
    this.name = name
    this.source = 'dump'
    this.sourcePageUrl = sourcePageUrl
    this.blueprint = {
      name: name,
    }
  }

  public async fetchCoverUrl(): Promise<string> {
    return 'https://marco79423.net/img/logo.png'
  }

  public async fetchAuthor(): Promise<string> {
    return 'author'
  }

  public async fetchSummary(): Promise<string> {
    return 'summary'
  }

  public async fetchCatalog(): Promise<string> {
    return 'catalog'
  }

  public async fetchLastUpdatedChapter(): Promise<string> {
    return 'lastUpdateChapter'
  }

  public async fetchLastUpdatedTime(): Promise<Date> {
    return new Date('2019-08-18')
  }

  async fetchChapters(): Promise<IWebComicChapter[]> {
    return []
  }

  startDownloadTask(filePath: string): Observable<ITaskStatus> {
    const total = 100

    return interval(10).pipe(
      map(i => i + 1),
      map(current => ({
        completed: current === total,
        progress: {
          current,
          total,
          status: `現在狀態是 ${current}`,
        }
      })),
      take(total),
    )
  }
}
