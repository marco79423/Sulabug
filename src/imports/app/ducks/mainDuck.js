import {createAction, handleActions} from 'redux-actions'
import {createSelector} from 'reselect'

export const Page = {
  BROWSE_PAGE: 'BROWSE_PAGE',
  COLLECTION_PAGE: 'COLLECTION_PAGE',
  DOWNLOAD_PAGE: 'DOWNLOAD_PAGE',
  SETTINGS_PAGE: 'SETTINGS_PAGE',
}

export const ActionTypes = {
  // app starts
  SEND_APP_START_SIGNAL: 'SEND_APP_START_SIGNAL',

  // init data
  WAIT_FOR_QUERYING_INIT_DATA_FROM_DB: 'WAIT_FOR_QUERYING_INIT_DATA_FROM_DB',
  SYNC_INIT_DATA_TO_STATE: 'SYNC_INIT_DATA_TO_STATE',

  // change page
  CHANGE_CURRENT_PAGE: 'CHANGE_CURRENT_PAGE',

  // auto update comic info database
  SEND_COMIC_INFO_DATABASE_EMPTY_SIGNAL: 'SEND_COMIC_INFO_DATABASE_EMPTY_SIGNAL',
  WAIT_FOR_COMIC_INFO_DATABASE_UPDATE: 'WAIT_FOR_COMIC_INFO_DATABASE_UPDATE',
  SYNC_COMIC_INFOS_TO_STATE: 'SYNC_COMIC_INFOS_TO_STATE',

  // search comic
  SEARCH_COMIC: 'SEARCH_COMIC',
  WAIT_FOR_RESULT_OF_SEARCHING_COMIC_INFOS_FROM_DB: 'WAIT_FOR_RESULT_OF_SEARCHING_COMIC_INFOS_FROM_DB',

  // add comic info to collection
  ADD_COMIC_TO_COLLECTION: 'ADD_COMIC_TO_COLLECTION',
  WAIT_FOR_ADDING_COMIC_INFO_COLLECTION: 'WAIT_FOR_ADDING_COMIC_INFO_COLLECTION',
  SEND_COLLECTION_CHANGED_SIGNAL: 'SEND_COLLECTION_CHANGED_SIGNAL',
  SYNC_COLLECTION_TO_STATE: 'SYNC_COLLECTION_TO_STATE',

  // create download task
  CREATE_DOWNLOAD_TASK: 'CREATE_DOWNLOAD_TASK',
  WAIT_FOR_CREATING_DOWNLOAD_TASK: 'WAIT_FOR_CREATING_DOWNLOAD_TASK',
  ADD_NEW_DOWNLOAD_TASK_TO_STATE: 'ADD_NEW_DOWNLOAD_TASK_TO_STATE',

  // update download status
  SEND_DOWNLOAD_STATUS_CHANGED_SIGNAL: 'SEND_DOWNLOAD_STATUS_CHANGED_SIGNAL',
  SYNC_DOWNLOAD_TASKS_TO_STATE: 'SYNC_DOWNLOAD_TASKS_TO_STATE',

  // update profile
  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
  WAIT_FOR_UPDATING_USER_PROFILE: 'WAIT_FOR_UPDATING_USER_PROFILE',
  SYNC_USER_PROFILE_TO_STATE: 'WAIT_FOR_UPDATING_USER_PROFILE',
}

export const actions = {
  // app starts
  sendAppStartSignal: createAction(ActionTypes.SEND_APP_START_SIGNAL),

  // init data
  waitForQueryingInitDataFromDB: createAction(ActionTypes.WAIT_FOR_QUERYING_INIT_DATA_FROM_DB),
  syncInitDataToState: createAction(ActionTypes.SYNC_INIT_DATA_TO_STATE),

  // change page
  changeCurrentPage: createAction(ActionTypes.CHANGE_CURRENT_PAGE),

  // auto update comic info database
  sendComicInfoDatabaseEmptySignal: createAction(ActionTypes.SEND_COMIC_INFO_DATABASE_EMPTY_SIGNAL),
  waitForComicInfoDatabaseUpdate: createAction(ActionTypes.WAIT_FOR_COMIC_INFO_DATABASE_UPDATE),
  syncComicInfosToState: createAction(ActionTypes.SYNC_COMIC_INFOS_TO_STATE),

  // search comic
  searchComic: createAction(ActionTypes.SEARCH_COMIC),
  waitForResultOfSearchingComicInfosFromDB: createAction(ActionTypes.WAIT_FOR_RESULT_OF_SEARCHING_COMIC_INFOS_FROM_DB),

  // add comic to collection
  addComicToCollection: createAction(ActionTypes.ADD_COMIC_TO_COLLECTION),
  waitForAddingComicToCollections: createAction(ActionTypes.WAIT_FOR_ADDING_COMIC_INFO_COLLECTION),
  sendCollectionChangedSignal: createAction(ActionTypes.SEND_COLLECTION_CHANGED_SIGNAL),
  syncCollectionToState: createAction(ActionTypes.SYNC_COLLECTION_TO_STATE),

  // create download task
  createDownloadTask: createAction(ActionTypes.CREATE_DOWNLOAD_TASK),
  waitForCreatingDownloadTask: createAction(ActionTypes.WAIT_FOR_CREATING_DOWNLOAD_TASK),
  addNewDownloadTaskToState: createAction(ActionTypes.ADD_NEW_DOWNLOAD_TASK_TO_STATE),

  // update download status
  sendDownloadStatusChangedSignal: createAction(ActionTypes.SEND_DOWNLOAD_STATUS_CHANGED_SIGNAL),
  syncDownloadTasksToState: createAction(ActionTypes.SYNC_DOWNLOAD_TASKS_TO_STATE),

  // update profile
  updateUserProfile: createAction(ActionTypes.UPDATE_USER_PROFILE),
  waitForUpdatingUserProfile: createAction(ActionTypes.WAIT_FOR_UPDATING_USER_PROFILE),
  syncUserProfileToState: createAction(ActionTypes.SYNC_USER_PROFILE_TO_STATE),
}

export const defaultState = {
  currentPage: Page.BROWSE_PAGE,
  userProfile: {
    downloadFolderPath: '',
  },
  comicInfo: {
    loading: false,
    allIds: [],
    byId: {},
  },
  collection: {
    loading: false,
    allIds: [],
    byId: {},
  },
  downloadTask: {
    loading: false,
    allIds: [],
    byId: {},
  },
}

export const reducer = handleActions({
  [ActionTypes.WAIT_FOR_QUERYING_INIT_DATA_FROM_DB]: (state) => ({
    ...state,
    comicInfo: {
      loading: true,
      allIds: [],
      byId: {},
    },
    collection: {
      loading: true,
      allIds: [],
      byId: {},
    },
    downloadTask: {
      loading: true,
      allIds: [],
      byId: {},
    },
  }),
  [ActionTypes.SYNC_INIT_DATA_TO_STATE]: (state, {payload: {userProfile, comicInfos, comics, downloadTasks}}) => ({
    ...state,
    userProfile,
    comicInfo: {
      loading: false,
      allIds: comicInfos.map(comicInfo => comicInfo.id),
      byId: comicInfos.reduce((comicInfoMap, comicInfo) => ({
        ...comicInfoMap,
        [comicInfo.id]: comicInfo,
      }), {}),
    },
    collection: {
      loading: false,
      allIds: comics.map(comic => comic.id),
      byId: comics.reduce((comicMap, comic) => ({
        ...comicMap,
        [comic.id]: comic,
      }), {}),
    },
    downloadTask: {
      loading: false,
      allIds: downloadTasks.map(downloadTask => downloadTask.id),
      byId: downloadTasks.reduce((downloadTaskMap, downloadTask) => ({
        ...downloadTaskMap,
        [downloadTask.id]: downloadTask,
      }), {}),
    },
  }),
  [ActionTypes.CHANGE_CURRENT_PAGE]: (state, action) => ({
    ...state,
    currentPage: action.payload,
  }),
  [ActionTypes.SYNC_COMIC_INFOS_TO_STATE]: (state, action) => ({
    ...state,
    comicInfo: {
      loading: false,
      allIds: action.payload.map(comicInfo => comicInfo.id),
      byId: action.payload.reduce((comicInfoMap, comicInfo) => ({
        ...comicInfoMap,
        [comicInfo.id]: comicInfo,
      }), {}),
    },
  }),
  [ActionTypes.SYNC_COLLECTION_TO_STATE]: (state, action) => ({
    ...state,
    collection: {
      loading: false,
      allIds: action.payload.map(comic => comic.id),
      byId: action.payload.reduce((comicMap, comic) => ({
        ...comicMap,
        [comic.id]: comic,
      }), {}),
    },
  }),
  [ActionTypes.WAIT_FOR_RESULT_OF_SEARCHING_COMIC_INFOS_FROM_DB]: (state) => ({
    ...state,
    comicInfo: {
      loading: true,
      allIds: [],
      byId: {},
    },
  }),
  [ActionTypes.WAIT_FOR_CREATING_DOWNLOAD_TASK]: (state) => ({
    ...state,
    downloadTask: {
      ...state.downloadTask,
      loading: true,
    },
  }),
  [ActionTypes.ADD_NEW_DOWNLOAD_TASK_TO_STATE]: (state, action) => ({
    ...state,
    downloadTask: {
      loading: false,
      allIds: [...state.downloadTask.allIds, action.payload.id],
      byId: {
        ...state.downloadTask.byId,
        [action.payload]: action.payload
      },
    },
  }),
  [ActionTypes.SYNC_DOWNLOAD_TASKS_TO_STATE]: (state, action) => ({
    ...state,
    downloadTask: {
      loading: false,
      allIds: action.payload.map(downloadTask => downloadTask.id),
      byId: action.payload.reduce((downloadTaskMap, downloadTask) => ({
        ...downloadTaskMap,
        [downloadTask.id]: downloadTask,
      }), {}),
    },
  }),
  [ActionTypes.SYNC_USER_PROFILE_TO_STATE]: (state, action) => ({
    ...state,
    userProfile: action.payload,
  }),
  [ActionTypes.QUERYING_COMIC_INFOS_FROM_DATABASE]: (state) => ({
    ...state,
    comicInfo: {
      loading: true,
      allIds: [],
      byId: {},
    },
  }),
  [ActionTypes.UPDATING_COMIC_INFO_DATABASE]: (state) => ({
    ...state,
    comicInfo: {
      loading: true,
      allIds: [],
      byId: {},
    },
  }),
  [ActionTypes.COMIC_INFOS_FROM_DATABASE_QUERIED]: (state, action) => ({
    ...state,
    comicInfo: {
      loading: false,
      allIds: action.payload.map(comicInfo => comicInfo.id),
      byId: action.payload.reduce((comicInfoMap, comicInfo) => ({
        ...comicInfoMap,
        [comicInfo.id]: comicInfo,
      }), {}),
    },
  }),
}, defaultState)


const selectCurrentPage = state => state.currentPage

const selectUserProfile = state => state.userProfile

const selectLoadingComicInfos = state => state.comicInfo.loading

const selectComicInfos = state => state.comicInfo.allIds.map(id => state.comicInfo.byId[id])

const selectLoadingCollections = state => state.collection.loading

const selectCollection = state => state.collection.allIds.map(id => state.collection.byId[id])

const selectLoadingDownloadTasks = state => state.downloadTask.loading

const selectLoadingDownloadTaskInfos = createSelector(
  [
    selectLoadingComicInfos,
    selectLoadingDownloadTasks,
  ],
  (loadingComicInfos, loadingDownloadTask) => loadingComicInfos || loadingDownloadTask
)

const selectDownloadTasks = state => state.downloadTask.allIds.map(id => state.downloadTask.byId[id])

export const selectors = {
  selectCurrentPage,
  selectUserProfile,
  selectLoadingComicInfos,
  selectComicInfos,
  selectLoadingCollections,
  selectCollection,
  selectLoadingDownloadTaskInfos,
  selectDownloadTasks,
}
