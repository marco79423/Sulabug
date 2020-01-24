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

export function* browserSaga() {
  yield takeEvery(queryComicsRequest, queryComicsSaga)
  yield takeEvery(queryCollectionsRequest, queryCollectionsSaga)
}

function* queryComicsSaga() {
  yield put(queryComicsProcessing())
  const coreService = createCoreService()

  if (yield call(coreService.checkIfComicDatabaseUpdateRequired.bind(coreService))) {
    yield call(coreService.updateComicDatabase.bind(coreService))
  }

  const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: false})
  yield put(queryComicsSuccess(comics.map(comic => ({
    id: comic.id,
    name: comic.name,
    coverUrl: comic.coverUrl,
    summary: comic.summary,
    lastUpdatedChapter: comic.lastUpdatedChapter,
    lastUpdatedTime: comic.lastUpdatedTime,
  }))))
}


function* queryCollectionsSaga() {
  yield put(queryCollectionsProcessing())
  const coreService = createCoreService()

  const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
  yield put(queryCollectionsSuccess(comics.map(comic => ({
    id: comic.id,
    name: comic.name,
    coverUrl: comic.coverUrl,
    summary: comic.summary,
  }))))
}
