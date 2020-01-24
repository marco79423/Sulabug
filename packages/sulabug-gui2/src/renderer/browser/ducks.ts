import {call, put, takeEvery} from 'redux-saga/effects'
import {createAction, createReducer, createSelector, PayloadAction} from '@reduxjs/toolkit'
import {createCoreService} from './services'

export const queryComicsRequest = createAction('browser/queryComics/request')
export const queryComicsProcessing = createAction('browser/queryComics/processing')
export const queryComicsSuccess = createAction<any[]>('browser/queryComics/success')
export const queryComicsFailure = createAction<Error>('browser/queryComics/failure')

export const queryCollectionsRequest = createAction('browser/queryCollections/request')
export const queryCollectionsProcessing = createAction('browser/queryCollections/processing')
export const queryCollectionsSuccess = createAction<any[]>('browser/queryCollections/success')
export const queryCollectionsFailure = createAction<Error>('browser/queryCollections/failure')

export const addComicToCollectionsRequest = createAction<number>('browser/addComicToCollections/request')
export const addComicToCollectionsProcessing = createAction('browser/addComicToCollections/processing')
export const addComicToCollectionsSuccess = createAction<number>('browser/addComicToCollections/success')
export const addComicToCollectionsFailure = createAction<Error>('browser/addComicToCollections/failure')

export const removeComicFromCollectionsRequest = createAction<number>('browser/removeComicFromCollections/request')
export const removeComicFromCollectionsProcessing = createAction('browser/removeComicFromCollections/processing')
export const removeComicFromCollectionsSuccess = createAction<number>('browser/removeComicFromCollections/success')
export const removeComicFromCollectionsFailure = createAction<Error>('browser/removeComicFromCollections/failure')


export interface IBrowserState {
  comics: {
    loading: boolean,
    data: any[],
    error?: Error
  },
  collections: {
    loading: boolean,
    data: any[],
    error?: Error
  },
  tasks: {
    addComicToCollections: {
      loading: boolean,
      error?: Error
    },
    removeComicFromCollections: {
      loading: boolean,
      error?: Error
    },
  }
}

const initialState: IBrowserState = {
  comics: {
    loading: false,
    data: [],
  },
  collections: {
    loading: false,
    data: [],
  },
  tasks: {
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
      tasks: {
        ...state.tasks,
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
      tasks: {
        ...state.tasks,
        addComicToCollection: {
          loading: false,
        },
      }
    }))
    .addCase(addComicToCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      tasks: {
        ...state.tasks,
        addComicToCollection: {
          loading: false,
          error: action.payload,
        },
      }
    }))
    // removeComicFromCollection
    .addCase(removeComicFromCollectionsProcessing, (state) => ({
      ...state,
      tasks: {
        ...state.tasks,
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
      tasks: {
        ...state.tasks,
        removeComicFromCollection: {
          loading: false,
        },
      }
    }))
    .addCase(removeComicFromCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      tasks: {
        ...state.tasks,
        removeComicFromCollection: {
          loading: false,
          error: action.payload,
        },
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

export function* browserSaga() {
  yield takeEvery(queryComicsRequest, queryComicsSaga)
  yield takeEvery(queryCollectionsRequest, queryCollectionsSaga)

  yield takeEvery(addComicToCollectionsRequest, addComicToCollectionSaga)
  yield takeEvery(removeComicFromCollectionsRequest, removeComicFromCollectionSaga)
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
