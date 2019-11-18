import {delay, put, select, takeEvery} from '@redux-saga/core/effects'

export interface IManagerState {
  count: number
}

const initialState: IManagerState = {
  count: 0,
}

export function reducer(state = initialState, action) {
  switch (action.type) {
    case 'manager/increment-count':
      return {...state, count: state.count + 1}
    default:
      return state
  }
}

export function* managerSaga() {
  console.log('manager')

  yield takeEvery('manager/increment-count', addLogSaga)

  while (true) {
    yield put({type: 'manager/increment-count'})
    yield delay(1000)
  }
}


function* addLogSaga() {
  const count = yield select(state => state.manager.count)

  yield put({type: 'browser/add-log', payload: count})
}
