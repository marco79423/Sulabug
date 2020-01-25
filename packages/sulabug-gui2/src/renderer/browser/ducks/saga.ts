import {call, put, takeEvery} from 'redux-saga/effects'

import * as actions from './actions'
import {createCoreService} from '../services'

export default function* browserSaga() {
  yield takeEvery(actions.queryComicsRequest, queryComicsSaga)
  yield takeEvery(actions.queryCollectionsRequest, queryCollectionsSaga)

  yield takeEvery(actions.addComicToCollectionsRequest, addComicToCollectionSaga)
  yield takeEvery(actions.removeComicFromCollectionsRequest, removeComicFromCollectionSaga)

  yield takeEvery(actions.queryConfigRequest, queryConfigSaga)
  yield takeEvery(actions.updateConfigRequest, updateConfigSaga)

  yield takeEvery(actions.updateDatabaseRequest, updateDatabaseSaga)

  yield takeEvery(actions.createDownloadTasksFromCollectionsRequest, createDownloadTasksFromCollectionsSaga)
}

function* queryComicsSaga() {
  try {
    yield put(actions.queryComicsProcessing())
    const coreService = createCoreService()

    if (yield call(coreService.checkIfComicDatabaseUpdateRequired.bind(coreService))) {
      yield call(coreService.updateComicDatabase.bind(coreService))
    }

    const collections = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: false})
    yield put(actions.queryComicsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
      inCollection: collections.filter(collection => collection.id === comic.id).length > 0
    }))))
  } catch (e) {
    yield put(actions.queryComicsFailure(e))
  }
}


function* queryCollectionsSaga() {
  try {
    yield put(actions.queryCollectionsProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    yield put(actions.queryCollectionsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
    }))))
  } catch (e) {
    yield put(actions.queryCollectionsFailure(e))
  }
}

function* addComicToCollectionSaga(action) {
  try {
    yield put(actions.addComicToCollectionsProcessing())
    const coreService = createCoreService()
    const comicId = action.payload
    yield call(coreService.addComicToCollections.bind(coreService), comicId)
    yield put(actions.addComicToCollectionsSuccess(comicId))
  } catch (e) {
    yield put(actions.addComicToCollectionsFailure(e))
  }
}

function* removeComicFromCollectionSaga(action) {
  try {
    yield put(actions.removeComicFromCollectionsProcessing())
    const coreService = createCoreService()
    const comicId = action.payload
    yield call(coreService.removeComicFromCollections.bind(coreService), comicId)
    yield put(actions.removeComicFromCollectionsSuccess(comicId))
  } catch (e) {
    yield put(actions.removeComicFromCollectionsFailure(e))
  }
}

function* queryConfigSaga() {
  try {
    yield put(actions.queryConfigProcessing())
    const coreService = createCoreService()

    const config = yield call(coreService.fetchConfig.bind(coreService))
    yield put(actions.queryConfigSuccess(config))
  } catch (e) {
    yield put(actions.queryConfigFailure(e))
  }
}

function* updateConfigSaga(action) {
  try {
    yield put(actions.updateConfigProcessing())
    const coreService = createCoreService()

    const config = action.payload
    yield call(coreService.updateConfig.bind(coreService), config)
    yield put(actions.updateConfigSuccess(config))
  } catch (e) {
    yield put(actions.updateConfigFailure(e))
  }
}

function* updateDatabaseSaga() {
  try {
    yield put(actions.updateDatabaseProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.updateComicDatabase.bind(coreService))
    yield put(actions.updateDatabaseSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      summary: comic.summary,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
    }))))
  } catch (e) {
    yield put(actions.updateDatabaseFailure(e))
  }
}

function* createDownloadTasksFromCollectionsSaga() {
  try {
    yield put(actions.createDownloadTasksFromCollectionsProcessing())
    const coreService = createCoreService()

    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    yield put(actions.createDownloadTasksFromCollectionsSuccess(comics.map(comic => ({
      id: comic.id,
      name: comic.name,
      coverUrl: comic.coverUrl,
      state: 'Pending',
      progress: 0,
      status: '',
    }))))
  } catch (e) {
    yield put(actions.createDownloadTasksFromCollectionsFailure(e))
  }
}
