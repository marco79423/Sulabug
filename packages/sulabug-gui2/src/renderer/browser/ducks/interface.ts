import * as sulabugCore from 'sulabug-core'

export interface IComicFilter extends sulabugCore.IComicFilter {
}

export interface IComic extends sulabugCore.IComic {
  readonly inCollection: boolean
  readonly state: string
}

export interface ICollection {
  readonly id: number
  readonly name: string
  readonly source: string
  readonly sourcePageUrl: string
  readonly coverUrl: string
  readonly author: string
  readonly summary: string
  readonly catalog: string
  readonly lastUpdatedChapter: string
  readonly lastUpdatedTime: Date
}

export interface IDownloadTask {
  readonly comicId: number
  readonly state: string
  readonly progress: number
  readonly status: string
}

export interface IProfile extends sulabugCore.IConfig {
  readonly downloadDirPath: string
  readonly lastDownloadTime: string | null
}

export interface IBrowserState {
  comics: {
    loading: boolean,
    data: IComic[],
  },
  downloadTasks: {
    loading: boolean,
    data: IDownloadTask[],
  },
  config: {
    loading: boolean,
    data: {},
  },
}
