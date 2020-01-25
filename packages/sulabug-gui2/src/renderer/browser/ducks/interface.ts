export {IConfig} from 'sulabug-core'

export interface IComic {
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
  readonly inCollection: boolean
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
  readonly id: number
  readonly name: string,
  readonly coverUrl: string,
  readonly state: string
  readonly progress: number
  readonly status: string
}

export interface IBrowserState {
  comics: {
    loading: boolean,
    data: IComic[],
    error?: Error
  },
  collections: {
    loading: boolean,
    data: ICollection[],
    error?: Error
  },
  downloadTasks: {
    loading: boolean,
    data: any[],
    error?: Error
  },
  config: {
    loading: boolean,
    data: {},
    error?: Error
  },
  asyncTasks: {
    addComicToCollections: {
      loading: boolean,
      error?: Error
    },
    removeComicFromCollections: {
      loading: boolean,
      error?: Error
    },
  },
}
