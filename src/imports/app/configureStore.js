import {applyMiddleware, compose, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {actions, defaultState, reducer} from './ducks/mainDuck'
import mainEpic from '../use-cases/mainEpic'
import injector from './injector'
import generalTypes from '../domain/general/generalTypes'
import libraryTypes from '../domain/library/libraryTypes'
import downloaderTypes from '../domain/downloader/downloaderTypes'

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      general: {
        configFactory: injector.get(generalTypes.ConfigFactory),
        configRepository: injector.get(generalTypes.ConfigRepository),
      },
      library: {
        sfComicInfoQueryAdapter: injector.get(libraryTypes.SFComicInfoQueryAdapter),
        comicInfoFactory: injector.get(libraryTypes.ComicInfoFactory),
        comicInfoInfoRepository: injector.get(libraryTypes.ComicInfoInfoRepository),
      },
      downloader: {
        eventPublisher: injector.get(downloaderTypes.EventPublisher),
        sfComicDownloadAdapter: injector.get(downloaderTypes.SFComicDownloadAdapter),
        downloadTaskFactory: injector.get(downloaderTypes.DownloadTaskFactory),
        downloadTaskRepository: injector.get(downloaderTypes.DownloadTaskRepository),
      },
      eventPublisher: injector.get(downloaderTypes.EventPublisher),
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
