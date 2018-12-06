import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map} from 'rxjs/operators'

import {Request} from '../../domain/base-types'
import domainInjector from '../domainInjector'
import {actions, ActionTypes} from '../ducks/mainDuck'
import QueryConfigUseCase from '../../domain/core/use-cases/QueryConfigUseCase'
import EventPublisher from '../../domain/downloader/event/EventPublisher'
import DownloadTaskUpdatedEvent from '../../domain/downloader/event/DownloadTaskUpdatedEvent'
import QueryComicInfosFromDatabaseUseCase from '../../domain/core/use-cases/QueryComicInfosFromDatabaseUseCase'
import QueryDownloadTasksUseCase from '../../domain/downloader/use-cases/QueryDownloadTasksUseCase'
import UpdateComicInfoDatabaseUseCase from '../../domain/core/use-cases/UpdateComicInfoDatabaseUseCase'
import CreateDownloadTaskUseCase from '../../domain/downloader/use-cases/CreateDownloadTaskUseCase'
import DownloadComicUseCase from '../../domain/downloader/use-cases/DownloadComicUseCase'
import UpdateConfigUseCase from '../../domain/core/use-cases/UpdateConfigUseCase'
import DeleteDownloadTaskUseCase from '../../domain/downloader/use-cases/DeleteDownloadTaskUseCase'

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
    from(domainInjector.get(QueryConfigUseCase).asyncExecute()
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
    from(domainInjector.get(QueryComicInfosFromDatabaseUseCase).asyncExecute(new Request(searchTerm))
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
    from(domainInjector.get(QueryDownloadTasksUseCase).asyncExecute()
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
    from(domainInjector.get(UpdateComicInfoDatabaseUseCase).asyncExecute()
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
    from(domainInjector.get(CreateDownloadTaskUseCase).asyncExecute(new Request(comicIInfoId))
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
    from(domainInjector.get(DeleteDownloadTaskUseCase).asyncExecute(new Request(downloadTaskId))
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
    from(domainInjector.get(DownloadComicUseCase).asyncExecute(new Request(downloadTask.id))
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
    from(domainInjector.get(UpdateConfigUseCase).asyncExecute(new Request(config))
      .then(() => actions.configUpdated(config))
    ),
  ))
)

export const handleDownloadTaskUpdatedEventEpic = () => domainInjector.get(EventPublisher).getEventStream().pipe(
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
