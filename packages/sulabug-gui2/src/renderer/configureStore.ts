import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import managerReducer from './manager/reducer'
import browserReducer from './browser/reducer'

declare global {
  interface Window { __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any; }
}


export default function configureStore() {
  const reducer = combineReducers({
    manager: managerReducer,
    browser: browserReducer,
  })

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
    ))
  )

  return store
}
