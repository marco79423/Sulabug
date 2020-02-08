import {call, put, select, takeEvery, delay} from 'redux-saga/effects'

import * as actions from './actions'
import {createCoreService} from '../services'
import {getDownloadTasks} from './selectors'

export default function* browserSaga() {
  yield takeEvery(actions.queryComicsRequest, queryComicsSaga)

  yield takeEvery(actions.addComicToCollectionsRequest, addComicToCollectionSaga)
  yield takeEvery(actions.removeComicFromCollectionsRequest, removeComicFromCollectionSaga)

  yield takeEvery(actions.queryConfigRequest, queryConfigSaga)
  yield takeEvery(actions.updateConfigRequest, updateConfigSaga)

  yield takeEvery(actions.updateDatabaseRequest, updateDatabaseSaga)

  yield takeEvery(actions.createDownloadTasksFromCollectionsRequest, createDownloadTasksFromCollectionsSaga)

  while (true) {
    const downloadTasks = yield select(getDownloadTasks)
    for(const downloadTask of downloadTasks) {
      if(downloadTask.state === 'Pending') {
        yield put(actions.handleDownloadTaskRequest(downloadTask))
      }
    }
    yield delay(5000)
  }
}

function* queryComicsSaga(action) {
  try {
    const pattern = action.payload
    yield put(actions.queryComicsProcessing())
    const coreService = createCoreService()

    if (yield call(coreService.checkIfComicDatabaseUpdateRequired.bind(coreService))) {
      yield call(coreService.updateComicDatabase.bind(coreService))
    }

    const collections = yield call(coreService.searchComics.bind(coreService), {pattern: pattern, marked: true})
    const comics = yield call(coreService.searchComics.bind(coreService), {pattern: pattern, marked: false})
    yield put(actions.queryComicsSuccess(comics.map(comic => ({
      ...comic,
      coverUrl: comic.coverUrl,
      author: comic.author,
      summary: comic.summary,
      catalog: comic.catalog,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
      inCollection: collections.filter(collection => collection.id === comic.id).length > 0,
      state: 'ready',
    }))))
  } catch (e) {
    yield put(actions.queryComicsFailure(e))
  }
}

function* addComicToCollectionSaga(action) {
  const comicId = action.payload
  try {
    yield put(actions.addComicToCollectionsProcessing(comicId))
    const coreService = createCoreService()
    yield call(coreService.addComicToCollections.bind(coreService), comicId)
    yield put(actions.addComicToCollectionsSuccess(comicId))
  } catch (e) {
    yield put(actions.addComicToCollectionsFailure({id: comicId, error: e}))
  }
}

function* removeComicFromCollectionSaga(action) {
  const comicId = action.payload
  try {
    yield put(actions.removeComicFromCollectionsProcessing(comicId))
    const coreService = createCoreService()
    yield call(coreService.removeComicFromCollections.bind(coreService), comicId)
    yield put(actions.removeComicFromCollectionsSuccess(comicId))
  } catch (e) {
    yield put(actions.removeComicFromCollectionsFailure({id: comicId, error: e}))
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

    const collections = yield call(coreService.searchComics.bind(coreService), {pattern: '', marked: true})
    const comics = yield call(coreService.updateComicDatabase.bind(coreService))
    yield put(actions.updateDatabaseSuccess(comics.map(comic => ({
      ...comic,
      coverUrl: comic.coverUrl,
      author: comic.author,
      summary: comic.summary,
      catalog: comic.catalog,
      lastUpdatedChapter: comic.lastUpdatedChapter,
      lastUpdatedTime: comic.lastUpdatedTime,
      inCollection: collections.filter(collection => collection.id === comic.id).length > 0,
      state: 'ready',
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
      comicId: comic.id,
      state: 'Pending',
      progress: 0,
      status: '',
    }))))
  } catch (e) {
    yield put(actions.createDownloadTasksFromCollectionsFailure(e))
  }
}
