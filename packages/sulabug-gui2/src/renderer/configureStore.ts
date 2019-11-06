import {combineReducers, createStore} from 'redux'
import managerReducer from './manager/reducer'
import browserReducer from './browser/reducer'


export default function configureStore() {
  const reducer = combineReducers({
    manager: managerReducer,
    browser: browserReducer,
  })

  const store = createStore(
    reducer,
  )

  return store
}
