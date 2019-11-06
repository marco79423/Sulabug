import {take} from 'redux-saga/effects'

export default function* rootSaga() {
  const action = yield take("common/initialize-app")
  console.log(action)
}
