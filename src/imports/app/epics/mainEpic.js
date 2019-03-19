import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap} from 'rxjs/operators'
import {actions, ActionTypes} from '../ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../../domain/downloader/event/DownloadTaskUpdatedEvent'

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

export const createDownloadTaskEpic = (action$, state$, {library: {comicInfoInfoRepository}, downloader: {downloadTaskFactory, downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.CREATE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(comicInfoId => concat(
    of(actions.waitForCreatingDownloadTask()),
    from(comicInfoInfoRepository.asyncGetById(comicInfoId)).pipe(
      map(comicInfo => downloadTaskFactory.createFromJson({
        id: comicInfo.identity,
        comicInfoId: comicInfo.identity,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
      })),
      tap(downloadTask => downloadTaskRepository.saveOrUpdate(downloadTask)),
      map(downloadTask => actions.addNewDownloadTaskToState(downloadTask.serialize())),
    ),
  ))
)

export const deleteDownloadTaskEpic = (action$, state$, {downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.DELETE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(downloadTaskId => concat(
    of(downloadTaskId).pipe(
      tap(downloadTaskId => downloadTaskRepository.delete(downloadTaskId)),
      mapTo(actions.deleteDownloadTaskFromState(downloadTaskId)),
    ),
  ))
)

export const startToDownloadComicWhenNewDownloadTaskCreatedEpic = (action$, state$, {downloader: {downloadTaskRepository, downloadComicService}}) => action$.pipe(
  ofType(
    ActionTypes.ADD_NEW_DOWNLOAD_TASK_TO_STATE,
  ),
  map(action => action.payload),
  flatMap(rawDownloadTask => concat(
    of(downloadTaskRepository.getById(rawDownloadTask.id)).pipe(
      tap(async (downloadTask) => {
        await downloadComicService.asyncDownload(downloadTask)
      }),
      mapTo(actions.sendDownloadStatusChangedSignal())
    ),
  ))
)

export const syncDownloadTasksToStateWhenDownloadStatusChanged = (action$, state$, {downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_DOWNLOAD_STATUS_CHANGED_SIGNAL,
  ),
  flatMap(() => concat(
    of(downloadTaskRepository.getAll()).pipe(
      map(downloadTasks => actions.syncDownloadTasksToState(downloadTasks.map(downloadTask => downloadTask.serialize()))),
    )
  ))
)

export const transformDownloadTaskUpdatedEventToSignalEpic = (action$, state$, {eventPublisher}) => eventPublisher.getEventStream().pipe(
  filter(event => event instanceof DownloadTaskUpdatedEvent),
  map(() => actions.sendDownloadStatusChangedSignal()),
)

export const updateUserProfileEpic = (action$, state$, {general: {userProfileFactory, userProfileRepository}}) => action$.pipe(
  ofType(
    ActionTypes.UPDATE_USER_PROFILE
  ),
  map(action => action.payload),
  map(userProfileData => userProfileFactory.createFromJson(userProfileData)),
  flatMap(userProfile => concat(
    of(actions.waitForUpdatingUserProfile()),
    of(userProfile).pipe(
      tap(userProfileRepository.asyncSaveOrUpdate(userProfile)),
      mapTo(actions.syncUserProfileToState(userProfile.serialize()))
    ),
  ))
)

export default combineEpics(
  // global
  sendAppStartSignalWhenAppStartsEpic,
  initializeDataFromDBWhenAppStartsEpic,

  // library
  sendSignalWhenComicInfoDBIsEmptyEpic,
  updateComicInfoDBWhenDBIsEmptyEpic,
  searchComicInfosEpic,

  // download
  createDownloadTaskEpic,
  deleteDownloadTaskEpic,
  startToDownloadComicWhenNewDownloadTaskCreatedEpic,
  syncDownloadTasksToStateWhenDownloadStatusChanged,
  transformDownloadTaskUpdatedEventToSignalEpic,

  // settings
  updateUserProfileEpic,
)
