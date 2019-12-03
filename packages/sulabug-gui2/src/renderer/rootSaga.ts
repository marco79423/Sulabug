import {call, take} from 'redux-saga/effects'
import {browserSaga} from './browser/ducks'

export default function* rootSaga() {
  const action = yield take('common/initialize-app')
  switch (action.data) {
    case 'browser':
      yield call(browserSaga)
      break
  }
}
