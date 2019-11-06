import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {forwardToMain, replayActionRenderer} from 'electron-redux'

import managerReducer from './manager/reducer'
import browserReducer from './browser/reducer'


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
      forwardToMain, // IMPORTANT! This goes first
    ))
  )

  replayActionRenderer(store)

  return store
}
