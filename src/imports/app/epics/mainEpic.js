import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap} from 'rxjs/operators'
import {actions, ActionTypes} from '../ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../../domain/event/DownloadTaskUpdatedEvent'

export const sendAppStartSignalWhenAppStartsEpic = () => of(
  actions.sendAppStartSignal()
)

export const initializeDataFromDBWhenAppStartsEpic = (action$, state$, {general: {userProfileRepository}, library: {comicInfoInfoRepository}, collection: {comicRepository}, downloader: {downloadTaskRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_APP_START_SIGNAL
  ),
  flatMap(() => concat(
    of(actions.waitForQueryingInitDataFromDB()),
    from(Promise.all([
        userProfileRepository.asyncGet(),
        comicInfoInfoRepository.asyncGetAllBySearchTerm(),
        comicRepository.asyncGetAll(),
        downloadTaskRepository.getAll()
      ]).then(([userProfile, comicInfos, comics, downloadTasks]) => ({
        userProfile: userProfile.serialize(),
        comics: comics.map(comic => comic.serialize()),
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

export const sendSignalWhenCollectionsIsNotEmptyEpic = (action$) => action$.pipe(
  ofType(
    ActionTypes.SYNC_INIT_DATA_TO_STATE
  ),
  map(action => action.payload.comics),
  filter(comics => comics.length > 0),
  mapTo(actions.sendCollectionChangedSignal())
)

export const addComicToCollectionEpic = (action$, state$, {collection: {comicFactory, comicRepository}}) => action$.pipe(
  ofType(
    ActionTypes.ADD_COMIC_TO_COLLECTION,
  ),
  map(action => comicFactory.createFromJson({comicInfoIdentity: action.payload})),
  flatMap(comic => concat(
    of(actions.waitForAddingComicToCollections()),
    from(comicRepository.asyncSaveOrUpdate(comic)).pipe(
      mapTo(actions.sendCollectionChangedSignal())
    )
  ))
)

export const syncCollectionToStateEpic = (action$, state$, {collection: {comicRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(() => from(comicRepository.asyncGetAll()).pipe(
    map(comics => actions.syncCollectionToState(comics.map(comic => comic.serialize())))
  ))
)

export const createCreateDownloadTasksWhenCollectionChangedEpic = (action$, state$, {collection: {comicRepository}}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(() => from(comicRepository.asyncGetAll()).pipe(
    flatMap(comics => from(comics)))
  ),
  map(comic => comic.comicInfoIdentity),
  map(comicInfoId => actions.createDownloadTask(comicInfoId)),
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

export const startToDownloadComicWhenNewDownloadTaskCreatedEpic = (action$, state$, {downloader: {downloadTaskRepository, downloadComicService}}) => action$.pipe(
  ofType(
    ActionTypes.ADD_NEW_DOWNLOAD_TASK_TO_STATE,
  ),
  map(action => action.payload),
  map(rawDownloadTask => downloadTaskRepository.getById(rawDownloadTask.id)),
  flatMap(downloadTask => from(downloadComicService.asyncDownload(downloadTask)).pipe(
    mapTo(actions.sendDownloadStatusChangedSignal())
  )),
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

  // collection
  sendSignalWhenCollectionsIsNotEmptyEpic,
  addComicToCollectionEpic,
  syncCollectionToStateEpic,
  createCreateDownloadTasksWhenCollectionChangedEpic,

  // download
  createDownloadTaskEpic,
  startToDownloadComicWhenNewDownloadTaskCreatedEpic,
  syncDownloadTasksToStateWhenDownloadStatusChanged,
  transformDownloadTaskUpdatedEventToSignalEpic,

  // settings
  updateUserProfileEpic,
)
