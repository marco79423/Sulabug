import {delay, put, take, takeEvery, call, select} from 'redux-saga/effects'
import {ipcRenderer} from 'electron'

export default function* rootSaga() {
  const action = yield take('common/initialize-app')

  switch (action.data) {
    case 'manager':
      yield call(managerSaga)
      break
    case 'browser':
      yield call(browserSaga)
      break
  }
}

function *managerSaga() {
  console.log('manager')

  yield takeEvery('manager/increment-count', addLogSaga)

  while (true) {
    yield put({type: 'manager/increment-count'})
    yield delay(1000)
  }
}


function *browserSaga() {
  console.log('browser')
}

function* addLogSaga() {
  const count = yield select(state => state.manager.count)

  // yield put({type: 'browser/add-log', data: count})
  ipcRenderer.send('sulabug-action', {type: 'browser/add-log', data: count})
}
