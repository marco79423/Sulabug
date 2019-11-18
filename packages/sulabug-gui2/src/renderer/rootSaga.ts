import {call, take} from 'redux-saga/effects'
import {managerSaga} from './manager/logic'
import {browserSaga} from './browser/logic'

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
