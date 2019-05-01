import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap, throttleTime} from 'rxjs/operators'
import {ipcRenderer} from 'electron'

import {actions, ActionTypes} from '../ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../../domain/event/DownloadTaskUpdatedEvent'
import * as path from 'path'

export const initializeDataFromDBWhenAppStartsEpic = (action$, state$, {userProfileRepository, comicInfoInfoRepository, collectionService, downloadTaskRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_APP_START_SIGNAL
  ),
  flatMap(() => concat(
    of(actions.waitForQueryingInitDataFromDB()),
    from(Promise.all([
        userProfileRepository.asyncGet(),
        comicInfoInfoRepository.asyncGetAllBySearchTerm(),
        collectionService.asyncGetAllComicsFromCollection(),
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

export const updateComicInfoDatabaseEpic = (action$, state$, {comicInfoDatabaseService}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COMIC_INFO_DATABASE_EMPTY_SIGNAL,
    ActionTypes.UPDATE_COMIC_INFO_DATABASE,
  ),
  flatMap(() => concat(
    of(actions.waitForComicInfoDatabaseUpdate()),
    from(comicInfoDatabaseService.asyncUpdateAndReturn()).pipe(
      map(comicInfos => actions.syncComicInfosToState(comicInfos.map(comicInfo => comicInfo.serialize()))),
    ),
    of(actions.sendComicInfoDatabaseUpdatedSignal())
  )),
)

export const searchComicInfosEpic = (action$, state$, {comicInfoInfoRepository}) => action$.pipe(
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

export const addComicToCollectionEpic = (action$, state$, {collectionService}) => action$.pipe(
  ofType(
    ActionTypes.ADD_COMIC_TO_COLLECTION,
  ),
  map(action => action.payload),
  flatMap(comicId => concat(
    of(actions.waitForAddingComicToCollections()),
    from(collectionService.asyncAddComicToCollection(comicId)).pipe(
      mapTo(actions.sendCollectionChangedSignal())
    )
  ))
)

export const removeComicFromCollectionEpic = (action$, state$, {collectionService}) => action$.pipe(
  ofType(
    ActionTypes.REMOVE_COMIC_FROM_COLLECTION,
  ),
  map(action => action.payload),
  flatMap(comicId => concat(
    of(actions.waitForRemovingComicFromCollection()),
    from(collectionService.asyncRemoveComicFromCollection(comicId)).pipe(
      mapTo(actions.sendCollectionChangedSignal())
    )
  ))
)

export const syncCollectionToStateEpic = (action$, state$, {collectionService}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(() => from(collectionService.asyncGetAllComicsFromCollection()).pipe(
    map(comics => actions.syncCollectionToState(comics.map(comic => comic.serialize())))
  ))
)

export const openReadingPageEpic = (action$) => action$.pipe(
  ofType(
    ActionTypes.OPEN_READING_PAGE
  ),
  throttleTime(2000),
  tap(action => {
    ipcRenderer.send('open-reading-page', action.payload)
  }),
)

export const loadComicImagesFromCollectionEpic = (action$, state$, {fileService, userProfileRepository, comicInfoInfoRepository}) => action$.pipe(
  ofType(
    ActionTypes.LOAD_COMIC_IMAGES_FROM_COLLECTION
  ),
  map(action => action.payload),
  flatMap(async comicInfoId => {
    const comicInfo = await comicInfoInfoRepository.asyncGetById(comicInfoId)

    const userProfile = await userProfileRepository.asyncGet()
    const possibleComicFolderPaths = await fileService.asyncListFolder(userProfile.downloadFolderPath)
    for (const possibleComicFolderPath of possibleComicFolderPaths) {
      const comicMeta = await fileService.asyncReadJson(path.join(possibleComicFolderPath, '.comic'), null)
      if (comicMeta !== null && comicMeta.id === comicInfoId) {
        const comicImages = []
        for (const chapter of comicInfo.chapters) {
          if (await fileService.asyncPathExists(path.join(possibleComicFolderPath, chapter.name, '.done'), null)) {
            const imagePaths = await fileService.asyncListFolder(path.join(possibleComicFolderPath, chapter.name))
            imagePaths.sort()

            comicImages.push({
              name: chapter.name,
              images: imagePaths
                .filter(imagePath => imagePath.endsWith('.jpg'))
                .map(imagePath => path.resolve(imagePath)),
            })
          }
        }
        return actions.syncComicImagesToState(comicImages)
      }
    }
  })
)


export const createCreateDownloadTasksWhenCollectionChangedEpic = (action$, state$, {collectionService}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(collectionService.asyncGetAllComicsFromCollection),
  flatMap(comics => from(comics)),
  map(comic => actions.createDownloadTask(comic.identity)),
)

export const createDownloadTaskEpic = (action$, state$, {comicInfoInfoRepository, downloadTaskFactory, downloadTaskRepository}) => action$.pipe(
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

export const startToDownloadComicWhenNewDownloadTaskCreatedEpic = (action$, state$, {downloadTaskRepository, downloadComicService}) => action$.pipe(
  ofType(
    ActionTypes.ADD_NEW_DOWNLOAD_TASK_TO_STATE,
  ),
  map(action => action.payload),
  map(rawDownloadTask => downloadTaskRepository.getById(rawDownloadTask.id)),
  flatMap(downloadTask => from(downloadComicService.asyncDownload(downloadTask)).pipe(
    mapTo(actions.sendDownloadStatusChangedSignal())
  )),
)

export const syncDownloadTasksToStateWhenDownloadStatusChanged = (action$, state$, {downloadTaskRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_DOWNLOAD_STATUS_CHANGED_SIGNAL,
  ),
  flatMap(() => of(downloadTaskRepository.getAll()).pipe(
    map(downloadTasks => actions.syncDownloadTasksToState(downloadTasks.map(downloadTask => downloadTask.serialize()))),
  ))
)

export const transformDownloadTaskUpdatedEventToSignalEpic = (action$, state$, {eventPublisher}) => eventPublisher.getEventStream().pipe(
  filter(event => event instanceof DownloadTaskUpdatedEvent),
  map(() => actions.sendDownloadStatusChangedSignal()),
)

export const autoUpdateUserProfileWhenComicInfoDatabaseUpdateEpic = (action$, state$, {userProfileRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COMIC_INFO_DATABASE_UPDATED_SIGNAL,
  ),
  flatMap(() => concat(
    of(actions.waitForUpdatingUserProfile()),
    from(userProfileRepository.asyncGet()).pipe(
      map(userProfile => actions.syncUserProfileToState(userProfile.serialize())),
    ),
)),
)

export const updateUserProfileEpic = (action$, state$, {userProfileFactory, userProfileRepository}) => action$.pipe(
  ofType(
    ActionTypes.UPDATE_USER_PROFILE
  ),
  map(action => userProfileFactory.createFromJson(action.payload)),
  flatMap(userProfile => concat(
    of(actions.waitForUpdatingUserProfile()),
    from(userProfileRepository.asyncSaveOrUpdate(userProfile)).pipe(
      mapTo(actions.syncUserProfileToState(userProfile.serialize())),
    ),
  )),
)

export default combineEpics(
  // global
  initializeDataFromDBWhenAppStartsEpic,

  // library
  sendSignalWhenComicInfoDBIsEmptyEpic,
  updateComicInfoDatabaseEpic,
  searchComicInfosEpic,
  autoUpdateUserProfileWhenComicInfoDatabaseUpdateEpic,

  // collection
  sendSignalWhenCollectionsIsNotEmptyEpic,
  addComicToCollectionEpic,
  removeComicFromCollectionEpic,
  syncCollectionToStateEpic,
  createCreateDownloadTasksWhenCollectionChangedEpic,
  openReadingPageEpic,
  loadComicImagesFromCollectionEpic,

  // download
  createDownloadTaskEpic,
  startToDownloadComicWhenNewDownloadTaskCreatedEpic,
  syncDownloadTasksToStateWhenDownloadStatusChanged,
  transformDownloadTaskUpdatedEventToSignalEpic,

  // settings
  updateUserProfileEpic,
)
