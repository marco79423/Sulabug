import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap} from 'rxjs/operators'

import {Request} from '../domain/base-types'
import {actions, ActionTypes} from '../app/ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../domain/downloader/event/DownloadTaskUpdatedEvent'

export const initializeEpic = () => of(
  actions.queryConfig(),
  actions.queryComicInfosFromDatabase(),
  actions.queryDownloadTasks(),
)

export const queryConfigEpic = (action$, state$, {general: {configRepository}}) => action$.pipe(
  ofType(
    ActionTypes.QUERY_CONFIG
  ),
  flatMap(() => concat(
    of(actions.queryingConfig()),
    from(configRepository.asyncGet()).pipe(
      map(config => actions.configQueried(config.serialize()))
    ),
  ))
)

export const queryComicInfosFromDatabaseEpic = (action$, state$, {library: {comicInfoInfoRepository}}) => action$.pipe(
  ofType(
    ActionTypes.QUERY_COMIC_INFOS_FROM_DATABASE,
    ActionTypes.COMIC_INFO_DATABASE_UPDATED,
    ActionTypes.SEARCH_COMIC,
  ),
  map(action => action ? action.payload : ''),
  flatMap(searchTerm => concat(
    of(actions.queryingComicInfosFromDatabase()),
    from(comicInfoInfoRepository.asyncGetAllBySearchTerm(searchTerm)).pipe(
      map(comicInfos => actions.comicInfosFromDatabaseQueried(comicInfos.map(comicInfo => comicInfo.serialize())))
    ),
  ))
)

export const queryDownloadTasksEpic = (action$, state$, {downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.QUERY_DOWNLOAD_TASKS,
    ActionTypes.DOWNLOAD_TASK_CREATED,
    ActionTypes.COMIC_DOWNLOADED,
  ),
  flatMap(() => concat(
    of(actions.queryingDownloadTasks()),
    of(downloadTaskRepository.getAll()).pipe(
      map(downloadTasks => actions.downloadTasksQueried(downloadTasks.map(downloadTask => downloadTask.serialize()))),
    )
  ))
)

export const changeCurrentPageEpic = action$ => action$.pipe(
  ofType(ActionTypes.CHANGE_CURRENT_PAGE),
  map(action => actions.currentPageChanged(action.payload)),
)

export const updateComicInfoDatabaseEpic = (action$, state$, {library: {comicInfoInfoRepository, sfComicInfoQueryAdapter}}) => action$.pipe(
  ofType(
    ActionTypes.COMIC_INFOS_FROM_DATABASE_QUERIED
  ),
  map(action => action.payload),
  filter(comicInfos => comicInfos.length === 0),
  flatMap(() => concat(
    of(actions.updatingComicInfoDatabase()),
    from(sfComicInfoQueryAdapter.asyncGetComicInfos()).pipe(
      tap(async (comicInfos) => {
        for (let comicInfo of comicInfos) {
          await comicInfoInfoRepository.asyncSaveOrUpdate(comicInfo)
        }
      }),
      mapTo(actions.comicInfoDatabaseUpdated())
    ),
  )),
)


export const createDownloadTaskEpic = (action$, state$, {library: {comicInfoInfoRepository}, downloader: {downloadTaskFactory, downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.CREATE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(comicInfoId => concat(
    of(actions.creatingDownloadTask()),
    from(comicInfoInfoRepository.asyncGetById(comicInfoId)).pipe(
      map(comicInfo => downloadTaskFactory.createFromJson({
        id: comicInfo.identity,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      })),
      tap(downloadTask => downloadTaskRepository.saveOrUpdate(downloadTask)),
      map(downloadTask => actions.downloadTaskCreated(downloadTask.serialize())),
    ),
  ))
)

export const deleteDownloadTaskEpic = (action$, state$, {deleteDownloadTaskUseCase}) => action$.pipe(
  ofType(
    ActionTypes.DELETE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(downloadTaskId => concat(
    of(actions.deletingDownloadTask()),
    deleteDownloadTaskUseCase.execute(new Request(downloadTaskId)).pipe(
      mapTo(actions.downloadTaskDeleted(downloadTaskId))
    ),
  ))
)

export const handleDownloadTaskEpic = (action$, state$, {downloadComicUseCase}) => action$.pipe(
  ofType(
    ActionTypes.DOWNLOAD_TASK_CREATED,
  ),
  map(action => action.payload),
  flatMap(downloadTask => concat(
    of(actions.downloadingComic()),
    downloadComicUseCase.execute(new Request(downloadTask.id)).pipe(
      mapTo(actions.comicDownloaded())
    ),
  ))
)

export const updateConfigEpic = (action$, state$, {general: {configFactory, configRepository}}) => action$.pipe(
  ofType(
    ActionTypes.UPDATE_CONFIG
  ),
  map(action => action.payload),
  map(rawConfig => configFactory.createFromJson(rawConfig)),
  flatMap(config => concat(
    of(actions.updatingConfig()),
    of(config).pipe(
      tap(configRepository.asyncSaveOrUpdate(config)),
      mapTo(actions.configUpdated(config.serialize()))
    ),
  ))
)

export const handleDownloadTaskUpdatedEventEpic = (action$, state$, {eventPublisher}) => eventPublisher.getEventStream().pipe(
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
