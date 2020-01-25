import {call, take} from 'redux-saga/effects'
import {combineEpics} from 'redux-observable'

import {browserEpic, browserSaga} from './browser/ducks'

export function* rootSaga() {
  const action = yield take('common/initialize-app')
  switch (action.data) {
    case 'browser':
      yield call(browserSaga)
      break
  }
}

export const rootEpic = combineEpics(
  browserEpic,
)
