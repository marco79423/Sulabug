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
      general: {
        userProfileFactory: injector.get(generalTypes.UserProfileFactory),
        userProfileRepository: injector.get(generalTypes.UserProfileRepository),
      },
      library: {
        comicInfoFactory: injector.get(libraryTypes.ComicInfoFactory),
        comicInfoInfoRepository: injector.get(libraryTypes.ComicInfoInfoRepository),
        comicInfoDatabaseService: injector.get(libraryTypes.ComicInfoDatabaseService),
      },
      downloader: {
        downloadTaskFactory: injector.get(downloaderTypes.DownloadTaskFactory),
        downloadTaskRepository: injector.get(downloaderTypes.DownloadTaskRepository),
        downloadComicService: injector.get(downloaderTypes.DownloadComicService),
      },
      eventPublisher: injector.get(downloaderTypes.EventPublisher),
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
