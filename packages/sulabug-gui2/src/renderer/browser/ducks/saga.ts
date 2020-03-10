import {END, eventChannel} from 'redux-saga'
import {call, delay, put, select, take, takeEvery} from 'redux-saga/effects'
import * as actions from './actions'
import {createCoreService} from '../services'
import {getDownloadTasks, isConfigLoading} from './selectors'

export default function* browserSaga() {
  yield takeEvery(actions.queryComicsRequest, queryComicsSaga)

  yield takeEvery(actions.addComicToCollectionsRequest, addComicToCollectionSaga)
  yield takeEvery(actions.removeComicFromCollectionsRequest, removeComicFromCollectionSaga)

  yield takeEvery(actions.queryConfigRequest, queryConfigSaga)
  yield takeEvery(actions.updateConfigRequest, updateConfigSaga)

  yield takeEvery(actions.updateDatabaseRequest, updateDatabaseSaga)

  yield takeEvery(actions.createDownloadTasksFromCollectionsRequest, createDownloadTasksFromCollectionsSaga)
  yield takeEvery(actions.handleDownloadTaskRequest, handleDownloadTaskSaga)

  while (true) {
    const downloadTasks = yield select(getDownloadTasks)
    for (const downloadTask of downloadTasks) {
      if (downloadTask.state === 'Pending') {
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
    const loading = yield select(isConfigLoading)
    if (loading) {
      return
    }

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

function* handleDownloadTaskSaga(action) {
  console.log('啟動下載任務 ...')
  const downloadTask = action.payload
  yield put(actions.handleDownloadTaskProcessing({
    ...downloadTask,
    state: 'Downloading',
  }))
  const coreService = createCoreService()
  const config = yield call(coreService.fetchConfig.bind(coreService))
  const downloadDirPath = config.downloadDirPath
  console.log(`取得下載路徑： ${downloadDirPath}`)

  const comics = yield call(coreService.searchComics.bind(coreService), {id: downloadTask.comicId, pattern: ''})
  if (comics.length !== 1) {
    yield put(actions.handleDownloadTaskFailure(new Error('unable to get target comic')))
  }

  const targetComic = comics[0]
  const channel = yield call(createHandleDownloadTaskChannel, targetComic, downloadDirPath)
  while (true) {
    const downloadStatus = yield take(channel)
    console.log(downloadStatus)
    yield put(actions.handleDownloadTaskProcessing({
      ...downloadTask,
      state: downloadStatus.completed ? 'Finished' : 'Downloading',
      progress: downloadStatus.progress.current / downloadStatus.progress.total * 100,
      status: downloadStatus.progress.status
    }))
    if (downloadStatus.completed) {
      break
    }
  }

  yield put(actions.updateConfigProcessing())
  const newProfile = {
    ...config,
    lastDownloadTime: new Date(),
  }

  yield call(coreService.updateConfig.bind(coreService), newProfile)
  yield put(actions.updateConfigSuccess(newProfile))
}

function createHandleDownloadTaskChannel(targetComic, downloadDirPath) {
  return eventChannel(emitter => {
    targetComic.startDownloadTask = targetComic.startDownloadTask.bind(targetComic)
    targetComic.startDownloadTask(downloadDirPath).subscribe(downloadStatus => {
      emitter(downloadStatus)
      if (downloadStatus.completed) {
        emitter(END)
      }
    })

    return () => {
    }
  })
}
