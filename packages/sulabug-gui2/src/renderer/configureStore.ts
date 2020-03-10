import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {forwardToMain, replayActionRenderer} from 'electron-redux'
import createSagaMiddleware from 'redux-saga'

import {rootSaga} from './rootDucks'
import browserReducer from './browser/ducks/reducer'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}


export default function configureStore() {
  const reducer = combineReducers({
    browser: browserReducer,
  })

  const sagaMiddleware = createSagaMiddleware()

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      forwardToMain, // IMPORTANT! This goes first
      sagaMiddleware,
    ))
  )

  sagaMiddleware.run(rootSaga)

  replayActionRenderer(store)

  return store
}
