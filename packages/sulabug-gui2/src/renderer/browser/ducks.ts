import {call, put, takeEvery} from 'redux-saga/effects'
import {createAction, createReducer, createSelector, PayloadAction} from '@reduxjs/toolkit'
import {combineEpics, Epic, ofType} from 'redux-observable'
import {flatMap, map} from 'rxjs/operators'

import {createCoreService} from './services'
import {IConfig, ITaskStatus} from 'sulabug-core'
import { merge, of } from 'rxjs'

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

export interface IConfig {

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

export const queryComicsRequest = createAction('browser/queryComics/request')
export const queryComicsProcessing = createAction('browser/queryComics/processing')
export const queryComicsSuccess = createAction<IComic[]>('browser/queryComics/success')
export const queryComicsFailure = createAction<Error>('browser/queryComics/failure')

export const queryCollectionsRequest = createAction('browser/queryCollections/request')
export const queryCollectionsProcessing = createAction('browser/queryCollections/processing')
export const queryCollectionsSuccess = createAction<ICollection[]>('browser/queryCollections/success')
export const queryCollectionsFailure = createAction<Error>('browser/queryCollections/failure')

export const addComicToCollectionsRequest = createAction<number>('browser/addComicToCollections/request')
export const addComicToCollectionsProcessing = createAction('browser/addComicToCollections/processing')
export const addComicToCollectionsSuccess = createAction<number>('browser/addComicToCollections/success')
export const addComicToCollectionsFailure = createAction<Error>('browser/addComicToCollections/failure')

export const removeComicFromCollectionsRequest = createAction<number>('browser/removeComicFromCollections/request')
export const removeComicFromCollectionsProcessing = createAction('browser/removeComicFromCollections/processing')
export const removeComicFromCollectionsSuccess = createAction<number>('browser/removeComicFromCollections/success')
export const removeComicFromCollectionsFailure = createAction<Error>('browser/removeComicFromCollections/failure')

export const queryConfigRequest = createAction('browser/queryConfig/request')
export const queryConfigProcessing = createAction('browser/queryConfig/processing')
export const queryConfigSuccess = createAction<IConfig>('browser/queryConfig/success')
export const queryConfigFailure = createAction<Error>('browser/queryConfig/failure')

export const updateConfigRequest = createAction<IConfig>('browser/updateConfig/request')
export const updateConfigProcessing = createAction('browser/updateConfig/processing')
export const updateConfigSuccess = createAction<IConfig>('browser/updateConfig/success')
export const updateConfigFailure = createAction<Error>('browser/updateConfig/failure')

export const updateDatabaseRequest = createAction('browser/updateDatabase/request')
export const updateDatabaseProcessing = createAction('browser/updateDatabase/processing')
export const updateDatabaseSuccess = createAction<IComic[]>('browser/updateDatabase/success')
export const updateDatabaseFailure = createAction<Error>('browser/updateDatabase/failure')

export const createDownloadTasksFromCollectionsRequest = createAction('browser/createDownloadTasksFromCollections/request')
export const createDownloadTasksFromCollectionsProcessing = createAction('browser/createDownloadTasksFromCollections/processing')
export const createDownloadTasksFromCollectionsSuccess = createAction<IDownloadTask[]>('browser/createDownloadTasksFromCollections/success')
export const createDownloadTasksFromCollectionsFailure = createAction<Error>('browser/createDownloadTasksFromCollections/failure')

export const updateDownloadTaskStatus = createAction<{ id: number, state: string, progress: number, status: string }>('browser/updateDownloadTaskStatus')


const initialState: IBrowserState = {
  comics: {
    loading: false,
    data: [],
  },
  collections: {
    loading: false,
    data: [],
  },
  downloadTasks: {
    loading: false,
    data: [],
  },
  config: {
    loading: false,
    data: {}
  },
  asyncTasks: {
    addComicToCollections: {
      loading: false,
    },
    removeComicFromCollections: {
      loading: false,
    },
  },
}


export const reducer = createReducer(
  initialState,
  builder => builder
    // queryComics
    .addCase(queryComicsProcessing, (state) => ({
      ...state,
      comics: {
        loading: true,
        data: [],
      }
    }))
    .addCase(queryComicsSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      comics: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(queryComicsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      comics: {
        loading: false,
        data: [],
        error: action.payload,
      }
    }))
    .addCase(queryCollectionsProcessing, (state) => ({
      ...state,
      collections: {
        loading: true,
        data: [],
      }
    }))
    .addCase(queryCollectionsSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      collections: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(queryCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      collections: {
        loading: false,
        data: [],
        error: action.payload,
      }
    }))
    // addComicToCollection
    .addCase(addComicToCollectionsProcessing, (state) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: true,
        },
      }
    }))
    .addCase(addComicToCollectionsSuccess, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              inCollection: true,
            }
          }
          return comic
        })
      },
      collections: {
        ...state.collections,
        data: [...state.collections.data, ...state.comics.data.filter(comic => comic.id === action.payload)],
      },
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: false,
        },
      }
    }))
    .addCase(addComicToCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: false,
          error: action.payload,
        },
      }
    }))
    // removeComicFromCollection
    .addCase(removeComicFromCollectionsProcessing, (state) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: true,
        },
      }
    }))
    .addCase(removeComicFromCollectionsSuccess, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              inCollection: false,
            }
          }
          return comic
        })
      },
      collections: {
        ...state.collections,
        data: state.collections.data.filter(collection => collection.id !== action.payload),
      },
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: false,
        },
      }
    }))
    .addCase(removeComicFromCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: false,
          error: action.payload,
        },
      }
    }))
    // queryConfig
    .addCase(queryConfigProcessing, (state) => ({
      ...state,
      config: {
        loading: true,
        data: {},
      }
    }))
    .addCase(queryConfigSuccess, (state, action: PayloadAction<IConfig>) => ({
      ...state,
      config: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(queryConfigFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      config: {
        loading: false,
        data: {},
        error: action.payload,
      }
    }))
    // updateConfig
    .addCase(updateConfigProcessing, (state) => ({
      ...state,
      config: {
        loading: true,
        data: {}
      },
    }))
    .addCase(updateConfigSuccess, (state, action: PayloadAction<IConfig>) => ({
      ...state,
      config: {
        loading: false,
        data: action.payload,
      },
    }))
    .addCase(updateConfigFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      config: {
        loading: false,
        data: {},
        error: action.payload,
      },
    }))
    // updateDatabase
    .addCase(updateDatabaseProcessing, (state) => ({
      ...state,
      comics: {
        loading: true,
        data: [],
      }
    }))
    .addCase(updateDatabaseSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      comics: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(updateDatabaseFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      comics: {
        loading: false,
        data: [],
        error: action.payload,
      }
    }))
    // createDownloadTasks
    .addCase(createDownloadTasksFromCollectionsSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: action.payload,
      }
    }))
    // updateDownloadTasks
    .addCase(updateDownloadTaskStatus, (state, action: PayloadAction<{ id: number, state: string, progress: number, status: string }>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: state.downloadTasks.data
          .filter(downloadTask => downloadTask.id !== action.payload.id || (downloadTask.id === action.payload.id && action.payload.state !== 'Finished'))
          .map(downloadTask => {
            if (downloadTask.id === action.payload.id) {
              return {
                ...downloadTask,
                ...action.payload,
              }
            }
            return downloadTask
          }),
      }
    }))
)

export const isComicsLoading = state => state.browser.comics.loading
export const getComics = state => state.browser.comics.data
export const getComicIds = createSelector(
  getComics,
  comics => comics.map(comic => comic.id),
)
export const getComicMap = createSelector(
  getComics,
  comics => comics.reduce((comicMap, comic) => ({
    ...comicMap,
    [comic.id]: comic,
  }), {})
)

export const isCollectionsLoading = state => state.browser.collections.loading
export const getCollections = state => state.browser.collections.data
export const getCollectionIds = createSelector(
  getCollections,
  collections => collections.map(collection => collection.id),
)
export const getCollectionMap = createSelector(
  getCollections,
  collections => collections.reduce((collectionMap, collection) => ({
    ...collectionMap,
    [collection.id]: collection,
  }), {})
)

export const getDownloadTasks = state => state.browser.downloadTasks.data
export const getDownloadTaskIds = createSelector(
  getDownloadTasks,
  downloadTasks => downloadTasks.map(downloadTask => downloadTask.id),
)
export const getDownloadTaskMap = createSelector(
  getDownloadTasks,
  downloadTasks => downloadTasks.reduce((downloadTaskMap, downloadTask) => ({
    ...downloadTaskMap,
    [downloadTask.id]: downloadTask,
  }), {})
)

export const isConfigLoading = state => state.browser.config.loading
export const getConfig = state => state.browser.config.data

export function* browserSaga() {
  yield takeEvery(queryComicsRequest, queryComicsSaga)
  yield takeEvery(queryCollectionsRequest, queryCollectionsSaga)

  yield takeEvery(addComicToCollectionsRequest, addComicToCollectionSaga)
  yield takeEvery(removeComicFromCollectionsRequest, removeComicFromCollectionSaga)

  yield takeEvery(queryConfigRequest, queryConfigSaga)
  yield takeEvery(updateConfigRequest, updateConfigSaga)

  yield takeEvery(updateDatabaseRequest, updateDatabaseSaga)

  yield takeEvery(createDownloadTasksFromCollectionsRequest, createDownloadTasksFromCollectionsSaga)
}

function* queryComicsSaga() {
  try {
    yield put(queryComicsProcessing())
    const coreService = createCoreService()

    if (yield call(coreService.checkIfComicDatabaseUpdateRequired.bind(coreService))) {
      yield call(coreService.updateComicDatabase.bind(coreService))
    }

    const collections = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: false})
    yield put(queryComicsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
      inCollection: collections.filter(collection => collection.id === comic.id).length > 0
    }))))
  } catch (e) {
    yield put(queryComicsFailure(e))
  }
}


function* queryCollectionsSaga() {
  try {
    yield put(queryCollectionsProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    yield put(queryCollectionsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
    }))))
  } catch (e) {
    yield put(queryCollectionsFailure(e))
  }
}

function* addComicToCollectionSaga(action) {
  try {
    yield put(addComicToCollectionsProcessing())
    const coreService = createCoreService()
    const comicId = action.payload
    yield call(coreService.addComicToCollections.bind(coreService), comicId)
    yield put(addComicToCollectionsSuccess(comicId))
  } catch (e) {
    yield put(addComicToCollectionsFailure(e))
  }
}

function* removeComicFromCollectionSaga(action) {
  try {
    yield put(removeComicFromCollectionsProcessing())
    const coreService = createCoreService()
    const comicId = action.payload
    yield call(coreService.removeComicFromCollections.bind(coreService), comicId)
    yield put(removeComicFromCollectionsSuccess(comicId))
  } catch (e) {
    yield put(removeComicFromCollectionsFailure(e))
  }
}

function* queryConfigSaga() {
  try {
    yield put(queryConfigProcessing())
    const coreService = createCoreService()

    const config = yield call(coreService.fetchConfig.bind(coreService))
    yield put(queryConfigSuccess(config))
  } catch (e) {
    yield put(queryConfigFailure(e))
  }
}

function* updateConfigSaga(action) {
  try {
    yield put(updateConfigProcessing())
    const coreService = createCoreService()

    const config = action.payload
    yield call(coreService.updateConfig.bind(coreService), config)
    yield put(updateConfigSuccess(config))
  } catch (e) {
    yield put(updateConfigFailure(e))
  }
}

function* updateDatabaseSaga() {
  try {
    yield put(updateDatabaseProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.updateComicDatabase.bind(coreService))
    yield put(updateDatabaseSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
    }))))
  } catch (e) {
    yield put(updateDatabaseFailure(e))
  }
}

function* createDownloadTasksFromCollectionsSaga() {
  try {
    yield put(createDownloadTasksFromCollectionsProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    yield put(createDownloadTasksFromCollectionsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      state: 'Pending',
      progress: 0,
      status: '',
    }))))
  } catch (e) {
    yield put(createDownloadTasksFromCollectionsFailure(e))
  }
}


export const handleDownloadTasksEpic: Epic = (action$, state$, {coreService}) => action$.pipe(
  ofType(
    createDownloadTasksFromCollectionsSuccess.type,
  ),
  map(action => action.payload),
  // map((downloadTasks: IDownloadTask[]) => downloadTasks[0]), // 暫時
  flatMap((downloadTasks: IDownloadTask[]) => merge(...downloadTasks.map(downloadTask => of(downloadTask).pipe(
    flatMap(async downloadTask => {
      const comics = await coreService.searchComics({id: downloadTask.id, pattern: ''})
      if (comics.length !== 1) {
        throw new Error('unable to get target comic')
      }

      const config = await coreService.fetchConfig()
      const targetComic = comics[0]
      return [targetComic, config.downloadDirPath]
    }),
    flatMap(([targetComic, downloadDirPath]) => targetComic.startDownloadTask(downloadDirPath).pipe(map((downloadStatus: ITaskStatus) => updateDownloadTaskStatus({
      id: targetComic.id,
      state: downloadStatus.completed ? 'Finished' : 'Downloading',
      progress: downloadStatus.progress.current / downloadStatus.progress.total * 100,
      status: downloadStatus.progress.status
    })))),
  )))),


  // flatMap(async downloadTask => {
  //   const comics = await coreService.searchComics({id: downloadTask.id, pattern: ''})
  //   if (comics.length !== 1) {
  //     throw new Error('unable to get target comic')
  //   }
  //
  //   const config = await coreService.fetchConfig()
  //   const targetComic = comics[0]
  //   return [targetComic, config.downloadDirPath]
  // }),
  // flatMap(([targetComic, downloadDirPath]) => targetComic.startDownloadTask(downloadDirPath).pipe(map((downloadStatus: ITaskStatus) => updateDownloadTaskStatus({
  //   id: targetComic.id,
  //   state: downloadStatus.completed ? 'Finished' : 'Downloading',
  //   progress: downloadStatus.progress.current / downloadStatus.progress.total * 100,
  //   status: downloadStatus.progress.status
  // })))),
)


export const browserEpic = combineEpics(
  handleDownloadTasksEpic
)
