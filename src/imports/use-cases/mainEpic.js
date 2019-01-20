import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap} from 'rxjs/operators'
import {actions, ActionTypes} from '../app/ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../domain/downloader/event/DownloadTaskUpdatedEvent'

export const sendAppStartSignalWhenAppStartsEpic = () => of(
  actions.sendAppStartSignal()
)

export const initializeDataFromDBWhenAppStartsEpic = (action$, state$, {general: {userProfileRepository}, library: {comicInfoInfoRepository}, downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_APP_START_SIGNAL
  ),
  flatMap(() => concat(
    of(actions.waitForQueryingInitDataFromDB()),
    from(Promise.all([
        userProfileRepository.asyncGet(),
        comicInfoInfoRepository.asyncGetAllBySearchTerm(),
        downloadTaskRepository.getAll()
      ]).then(([userProfile, comicInfos, downloadTasks]) => ({
        userProfile: userProfile.serialize(),
        comicInfos: comicInfos.map(comicInfo => comicInfo.serialize()),
        downloadTasks: downloadTasks.map(downloadTask => downloadTask.serialize()),
      }))
    ).pipe(
      map(initData => actions.syncInitDataToState(initData))
    ),
  ))
)

export const sendSignalWhenComicInfoDBIsEmptyEpic = (action$) => action$.pipe(
  ofType(
    ActionTypes.SYNC_INIT_DATA_TO_STATE
  ),
  map(action => action.payload.comicInfos),
  filter(comicInfos => comicInfos.length === 0),
  mapTo(actions.sendComicInfoDatabaseEmptySignal())
)

export const updateComicInfoDBWhenDBIsEmptyEpic = (action$, state$, {library: {comicInfoDatabaseService}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COMIC_INFO_DATABASE_EMPTY_SIGNAL
  ),
  flatMap(() => concat(
    of(actions.waitForComicInfoDatabaseUpdate()),
    from(comicInfoDatabaseService.asyncUpdateAndReturn()).pipe(
      map(comicInfos => actions.syncComicInfosToState(comicInfos.map(comicInfo => comicInfo.serialize())))
    ),
  )),
)

export const searchComicInfosEpic = (action$, state$, {library: {comicInfoInfoRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEARCH_COMIC
  ),
  map(action => action ? action.payload : ''),
  flatMap(searchTerm => concat(
    of(actions.waitForResultOfSearchingComicInfosFromDB()),
    from(comicInfoInfoRepository.asyncGetAllBySearchTerm(searchTerm)).pipe(
      map(comicInfos => actions.syncComicInfosToState(comicInfos.map(comicInfo => comicInfo.serialize())))
    ),
  )),
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

export const deleteDownloadTaskEpic = (action$, state$, {downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.DELETE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(downloadTaskId => concat(
    of(actions.deletingDownloadTask()),
    of(downloadTaskId).pipe(
      tap(downloadTaskId => downloadTaskRepository.delete(downloadTaskId)),
      mapTo(actions.downloadTaskDeleted(downloadTaskId)),
    ),
  ))
)

export const handleDownloadTaskEpic = (action$, state$, {downloader: {downloadTaskRepository, downloadComicService}}) => action$.pipe(
  ofType(
    ActionTypes.DOWNLOAD_TASK_CREATED,
  ),
  map(action => action.payload),
  flatMap(rawDownloadTask => concat(
    of(actions.downloadingComic()),
    of(downloadTaskRepository.getById(rawDownloadTask.id)).pipe(
      tap(async (downloadTask) => {
        await downloadComicService.asyncDownload(downloadTask)
      }),
      mapTo(actions.comicDownloaded())
    ),
  ))
)

export const updateUserProfileEpic = (action$, state$, {general: {userProfileFactory, userProfileRepository}}) => action$.pipe(
  ofType(
    ActionTypes.UPDATE_USER_PROFILE
  ),
  map(action => action.payload),
  map(userProfileData => userProfileFactory.createFromJson(userProfileData)),
  flatMap(userProfile => concat(
    of(actions.updatingUserProfile()),
    of(userProfile).pipe(
      tap(userProfileRepository.asyncSaveOrUpdate(userProfile)),
      mapTo(actions.userProfileUpdated(userProfile.serialize()))
    ),
  ))
)

export const handleDownloadTaskUpdatedEventEpic = (action$, state$, {eventPublisher}) => eventPublisher.getEventStream().pipe(
  filter(event => event instanceof DownloadTaskUpdatedEvent),
  map(() => actions.queryDownloadTasks()),
)

export default combineEpics(
  // global
  sendAppStartSignalWhenAppStartsEpic,
  initializeDataFromDBWhenAppStartsEpic,

  // library
  sendSignalWhenComicInfoDBIsEmptyEpic,
  updateComicInfoDBWhenDBIsEmptyEpic,
  searchComicInfosEpic,

  queryDownloadTasksEpic,

  createDownloadTaskEpic,
  deleteDownloadTaskEpic,
  handleDownloadTaskEpic,

  updateUserProfileEpic,

  handleDownloadTaskUpdatedEventEpic,
)
