import {applyMiddleware, compose, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {actions, defaultState, reducer} from './ducks/mainDuck'
import mainEpic from './epics/mainEpic'
import injector from './injector'
import generalTypes from '../domain/general/generalTypes'
import libraryTypes from '../domain/library/libraryTypes'
import downloaderTypes from '../domain/downloader/downloaderTypes'

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      // general
      queryConfigUseCase: injector.get(generalTypes.QueryConfigUseCase),
      updateConfigUseCase: injector.get(generalTypes.UpdateConfigUseCase),
      // library
      queryComicInfoByIdentityFromDatabaseUseCase: injector.get(libraryTypes.QueryComicInfoByIdentityFromDatabaseUseCase),
      queryComicInfosFromDatabaseUseCase: injector.get(libraryTypes.QueryComicInfosFromDatabaseUseCase),
      updateComicInfoDatabaseUseCase: injector.get(libraryTypes.UpdateComicInfoDatabaseUseCase),
      // downloader
      eventPublisher: injector.get(downloaderTypes.EventPublisher),
      createDownloadTaskUseCase: injector.get(downloaderTypes.CreateDownloadTaskUseCase),
      deleteDownloadTaskUseCase: injector.get(downloaderTypes.DeleteDownloadTaskUseCase),
      downloadComicUseCase: injector.get(downloaderTypes.DownloadComicUseCase),
      queryDownloadTasksUseCase: injector.get(downloaderTypes.QueryDownloadTasksUseCase),
    }
  })

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actions
    }) : compose

  const store = createStore(
    reducer,
    defaultState,
    composeEnhancers(applyMiddleware(
      epicMiddleware,
    ))
  )

  epicMiddleware.run(mainEpic)

  return store
}
