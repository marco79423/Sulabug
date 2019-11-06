import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {forwardToMain, replayActionRenderer} from 'electron-redux'
import createSagaMiddleware from 'redux-saga'

import managerReducer from './manager/reducer'
import browserReducer from './browser/reducer'
import rootSaga from './rootSaga'


export default function configureStore() {
  const reducer = combineReducers({
    manager: managerReducer,
    browser: browserReducer,
  })

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

  const sagaMiddleware = createSagaMiddleware()

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
