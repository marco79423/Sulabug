import {applyMiddleware, compose, createStore} from 'redux'
import {createEpicMiddleware} from 'redux-observable'

import {actions, defaultState, reducer} from './ducks/mainDuck'
import mainEpic from './epics/mainEpic'
import injector from './injector'
import types from '../domain/types'

export default function configureStore() {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      userProfileFactory: injector.get(types.UserProfileFactory),
      userProfileRepository: injector.get(types.UserProfileRepository),
      fileService: injector.get(types.FileService),

      comicFactory: injector.get(types.ComicFactory),
      comicRepository: injector.get(types.ComicRepository),
      comicDatabaseService: injector.get(types.ComicDatabaseService),

      collectionService: injector.get(types.CollectionService),

      downloadTaskFactory: injector.get(types.DownloadTaskFactory),
      downloadTaskRepository: injector.get(types.DownloadTaskRepository),
      downloadComicService: injector.get(types.DownloadComicService),

      eventPublisher: injector.get(types.EventPublisher),
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
