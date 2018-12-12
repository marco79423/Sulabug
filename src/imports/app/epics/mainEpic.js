import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map} from 'rxjs/operators'

import {Request} from '../../domain/base-types'
import injector from '../injector'
import generalTypes from '../../domain/general/generalTypes'
import libraryTypes from '../../domain/library/libraryTypes'
import downloaderTypes from '../../domain/downloader/downloaderTypes'
import {actions, ActionTypes} from '../ducks/mainDuck'
import EventPublisher from '../../domain/downloader/event/EventPublisher'
import DownloadTaskUpdatedEvent from '../../domain/downloader/event/DownloadTaskUpdatedEvent'

export const initializeEpic = () => of(
  actions.queryConfig(),
  actions.queryComicInfosFromDatabase(),
  actions.queryDownloadTasks(),
)

export const queryConfigEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.QUERY_CONFIG
  ),
  flatMap(() => concat(
    of(actions.queryingConfig()),
    from(injector.get(generalTypes.QueryConfigUseCase).asyncExecute()
      .then(res => res.data)
      .then(config => actions.configQueried(config))
    ),
  ))
)

export const queryComicInfosFromDatabaseEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.QUERY_COMIC_INFOS_FROM_DATABASE,
    ActionTypes.COMIC_INFO_DATABASE_UPDATED,
    ActionTypes.SEARCH_COMIC,
  ),
  map(action => action ? action.payload : ''),
  flatMap(searchTerm => concat(
    of(actions.queryingComicInfosFromDatabase()),
    from(injector.get(libraryTypes.QueryComicInfosFromDatabaseUseCase).asyncExecute(new Request(searchTerm))
      .then(res => res.data)
      .then(comicInfos => actions.comicInfosFromDatabaseQueried(comicInfos))
    ),
  ))
)

export const queryDownloadTasksEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.QUERY_DOWNLOAD_TASKS,
    ActionTypes.DOWNLOAD_TASK_CREATED,
    ActionTypes.COMIC_DOWNLOADED,
  ),
  flatMap(() => concat(
    of(actions.queryingDownloadTasks()),
    from(injector.get(downloaderTypes.QueryDownloadTasksUseCase).asyncExecute()
      .then(res => res.data)
      .then(downloadTasks => actions.downloadTasksQueried(downloadTasks)))
  )),
)

export const changeCurrentPageEpic = action$ => action$.pipe(
  ofType(ActionTypes.CHANGE_CURRENT_PAGE),
  map(action => actions.currentPageChanged(action.payload)),
)

export const updateComicInfoDatabaseEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.COMIC_INFOS_FROM_DATABASE_QUERIED
  ),
  map(action => action.payload),
  filter(comicInfos => comicInfos.length === 0),
  flatMap(() => concat(
    of(actions.updatingComicInfoDatabase()),
    from(injector.get(libraryTypes.UpdateComicInfoDatabaseUseCase).asyncExecute()
      .then(() => actions.comicInfoDatabaseUpdated())
    ),
  )),
)


export const createDownloadTaskEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.CREATE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(comicIInfoId => concat(
    of(actions.creatingDownloadTask()),
    from(injector.get(downloaderTypes.CreateDownloadTaskUseCase).asyncExecute(new Request(comicIInfoId))
      .then(res => res.data)
      .then(downloadTask => actions.downloadTaskCreated(downloadTask))
    ),
  ))
)

export const deleteDownloadTaskEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.DELETE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(downloadTaskId => concat(
    of(actions.deletingDownloadTask()),
    from(injector.get(downloaderTypes.DeleteDownloadTaskUseCase).asyncExecute(new Request(downloadTaskId))
      .then(() => actions.downloadTaskDeleted(downloadTaskId))
    ),
  ))
)

export const handleDownloadTaskEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.DOWNLOAD_TASK_CREATED,
  ),
  map(action => action.payload),
  flatMap(downloadTask => concat(
    of(actions.downloadingComic()),
    from(injector.get(downloaderTypes.DownloadComicUseCase).asyncExecute(new Request(downloadTask.id))
      .then(() => actions.comicDownloaded())
    ),
  ))
)

export const updateConfigEpic = action$ => action$.pipe(
  ofType(
    ActionTypes.UPDATE_CONFIG
  ),
  map(action => action.payload),
  flatMap(config => concat(
    of(actions.updatingConfig()),
    from(injector.get(generalTypes.UpdateConfigUseCase).asyncExecute(new Request(config))
      .then(() => actions.configUpdated(config))
    ),
  ))
)

export const handleDownloadTaskUpdatedEventEpic = () => injector.get(EventPublisher).getEventStream().pipe(
  filter(event => event instanceof DownloadTaskUpdatedEvent),
  map(() => actions.queryDownloadTasks()),
)

export default combineEpics(
  initializeEpic,
  queryConfigEpic,
  queryComicInfosFromDatabaseEpic,
  queryDownloadTasksEpic,

  changeCurrentPageEpic,

  updateComicInfoDatabaseEpic,
  createDownloadTaskEpic,
  deleteDownloadTaskEpic,
  handleDownloadTaskEpic,

  updateConfigEpic,

  handleDownloadTaskUpdatedEventEpic,
)
