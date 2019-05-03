import {concat, from, of} from 'rxjs'
import {combineEpics, ofType} from 'redux-observable'
import {filter, flatMap, map, mapTo, tap, throttleTime} from 'rxjs/operators'
import {ipcRenderer} from 'electron'

import {actions, ActionTypes} from '../ducks/mainDuck'
import DownloadTaskUpdatedEvent from '../../domain/event/DownloadTaskUpdatedEvent'
import * as path from 'path'

export const initializeDataFromDBWhenAppStartsEpic = (action$, state$, {userProfileRepository, comicRepository, downloadTaskRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_APP_START_SIGNAL
  ),
  flatMap(() => concat(
    of(actions.waitForQueryingInitDataFromDB()),
    from(Promise.all([
        userProfileRepository.asyncGet(),
        comicRepository.asyncGetAllBySearchTerm(),
        downloadTaskRepository.getAll()
      ]).then(([userProfile, comics, downloadTasks]) => ({
        userProfile: userProfile.serialize(),
        comics: comics.map(comic => comic.serialize()),
        downloadTasks: downloadTasks.map(downloadTask => downloadTask.serialize()),
      }))
    ).pipe(
      map(initData => actions.syncInitDataToState(initData))
    ),
  ))
)

export const sendSignalWhenComicDBIsEmptyEpic = (action$) => action$.pipe(
  ofType(
    ActionTypes.SYNC_INIT_DATA_TO_STATE
  ),
  map(action => action.payload.comics),
  filter(comics => comics.length === 0),
  mapTo(actions.sendComicDatabaseEmptySignal())
)

export const updateComicDatabaseEpic = (action$, state$, {comicDatabaseService}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COMIC_DATABASE_EMPTY_SIGNAL,
    ActionTypes.UPDATE_COMIC_DATABASE,
  ),
  flatMap(() => concat(
    of(actions.waitForComicDatabaseUpdate()),
    from(comicDatabaseService.asyncUpdateAndReturn()).pipe(
      map(comics => actions.syncComicsToState(comics.map(comic => comic.serialize()))),
    ),
    of(actions.sendComicDatabaseUpdatedSignal())
  )),
)

export const searchComicsEpic = (action$, state$, {comicRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEARCH_COMIC
  ),
  map(action => action ? action.payload : ''),
  flatMap(searchTerm => concat(
    of(actions.waitForResultOfSearchingComicsFromDB()),
    from(comicRepository.asyncGetAllBySearchTerm(searchTerm)).pipe(
      map(comics => actions.syncComicsToState(comics.map(comic => comic.serialize())))
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

export const addComicToCollectionEpic = (action$, state$, {comicRepository}) => action$.pipe(
  ofType(
    ActionTypes.ADD_COMIC_TO_COLLECTION,
  ),
  map(action => action.payload),
  flatMap(comicId => concat(
    of(actions.waitForUpdatingCollection()),
    from((async () => {
      const comic = await comicRepository.asyncGetById(comicId)
      comic.inCollection = true
      await comicRepository.asyncSaveOrUpdate(comic)
      return actions.sendCollectionChangedSignal()
    })()),
  ))
)

export const removeComicFromCollectionEpic = (action$, state$, {comicRepository, fileService, userProfileRepository}) => action$.pipe(
  ofType(
    ActionTypes.REMOVE_COMIC_FROM_COLLECTION,
  ),
  map(action => action.payload),
  flatMap(comicId => concat(
    of(actions.waitForUpdatingCollection()),
    from((async () => {
      const comic = await comicRepository.asyncGetById(comicId)
      comic.inCollection = false
      await comicRepository.asyncSaveOrUpdate(comic)

      const userProfile = await userProfileRepository.asyncGet()
      await fileService.asyncRemove(path.join(userProfile.downloadFolderPath, comic.name))

      return actions.sendCollectionChangedSignal()
    })()),
  ))
)

export const syncCollectionToStateEpic = (action$, state$, {comicRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(() => comicRepository.asyncGetAllBySearchTerm('')),
  map(comics => actions.syncComicsToState(comics.map(comic => comic.serialize()))),
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

export const loadComicImagesFromCollectionEpic = (action$, state$, {fileService, userProfileRepository, comicRepository}) => action$.pipe(
  ofType(
    ActionTypes.LOAD_COMIC_IMAGES_FROM_COLLECTION
  ),
  map(action => action.payload),
  flatMap(async comicId => {
    const comic = await comicRepository.asyncGetById(comicId)

    const userProfile = await userProfileRepository.asyncGet()
    const comicPath = path.join(userProfile.downloadFolderPath, comic.name)

    const comicImages = []
    for (const chapter of comic.chapters) {
      if (await fileService.asyncPathExists(path.join(comicPath, chapter.name, '.done'), null)) {
        const imagePaths = await fileService.asyncListFolder(path.join(comicPath, chapter.name))
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
  })
)

export const createCreateDownloadTasksWhenCollectionChangedEpic = (action$, state$, {comicRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL,
  ),
  flatMap(() => comicRepository.asyncGetAllBySearchTerm('')),
  flatMap(comics => from(comics)),
  filter(comic => comic.inCollection),
  map(comic => actions.createDownloadTask(comic.id)),
)


export const createDownloadTaskEpic = (action$, state$, {comicRepository, downloadTaskFactory, downloadTaskRepository}) => action$.pipe(
  ofType(
    ActionTypes.CREATE_DOWNLOAD_TASK
  ),
  map(action => action.payload),
  flatMap(comicId => concat(
    of(actions.waitForCreatingDownloadTask()),
    from(comicRepository.asyncGetById(comicId)).pipe(
      map(comic => downloadTaskFactory.createFromJson({
        id: comic.id,
        comicId: comic.id,
        name: comic.name,
        coverDataUrl: comic.coverDataUrl,
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

export const autoUpdateUserProfileWhenComicDatabaseUpdateEpic = (action$, state$, {userProfileRepository}) => action$.pipe(
  ofType(
    ActionTypes.SEND_COMIC_DATABASE_UPDATED_SIGNAL,
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
  sendSignalWhenComicDBIsEmptyEpic,
  updateComicDatabaseEpic,
  searchComicsEpic,
  autoUpdateUserProfileWhenComicDatabaseUpdateEpic,

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
