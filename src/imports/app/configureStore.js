import {applyMiddleware, compose, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {actions, defaultState, reducer} from './ducks/mainDuck'
import mainEpic from './epics/mainEpic'
import injector from './injector'
import types from '../domain/types'

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      general: {
        userProfileFactory: injector.get(types.UserProfileFactory),
        userProfileRepository: injector.get(types.UserProfileRepository),
      },
      library: {
        comicInfoFactory: injector.get(types.ComicInfoFactory),
        comicInfoInfoRepository: injector.get(types.ComicInfoRepository),
        comicInfoDatabaseService: injector.get(types.ComicInfoDatabaseService),
      },
      collection: {
        comicFactory: injector.get(types.ComicFactory),
        comicRepository: injector.get(types.ComicRepository),
      },
      downloader: {
        downloadTaskFactory: injector.get(types.DownloadTaskFactory),
        downloadTaskRepository: injector.get(types.DownloadTaskRepository),
        downloadComicService: injector.get(types.DownloadComicService),
      },
      eventPublisher: injector.get(types.EventPublisher),
      fileService: injector.get(types.FileService),
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
