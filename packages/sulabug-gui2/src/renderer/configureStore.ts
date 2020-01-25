import {applyMiddleware, combineReducers, compose, createStore} from 'redux'
import {forwardToMain, replayActionRenderer} from 'electron-redux'
import createSagaMiddleware from 'redux-saga'
import {createEpicMiddleware} from 'redux-observable'

import {rootSaga, rootEpic} from './rootDucks'
import browserReducer from './browser/ducks/reducer'
import {createCoreService} from './browser/services'

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
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      coreService: createCoreService(),
    }
  })

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose

  const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(
      forwardToMain, // IMPORTANT! This goes first
      sagaMiddleware,
      epicMiddleware,
    ))
  )

  sagaMiddleware.run(rootSaga)
  epicMiddleware.run(rootEpic)

  replayActionRenderer(store)

  return store
}
