import {createAction, handleActions} from 'redux-actions'
import {createSelector} from 'reselect'

export const Page = {
  BROWSE_PAGE: 'BROWSE_PAGE',
  DOWNLOAD_PAGE: 'DOWNLOAD_PAGE',
  SETTINGS_PAGE: 'SETTINGS_PAGE',
}

export const ActionTypes = {
  SEND_APP_START_SIGNAL: 'SEND_APP_START_SIGNAL',

  CHANGE_CURRENT_PAGE: 'CHANGE_CURRENT_PAGE',

  QUERY_USER_PROFILE: 'QUERY_USER_PROFILE',
  QUERYING_USER_PROFILE: 'QUERYING_USER_PROFILE',
  USER_PROFILE_QUERIED: 'USER_PROFILE_QUERIED',

  UPDATE_USER_PROFILE: 'UPDATE_USER_PROFILE',
  UPDATING_USER_PROFILE: 'UPDATING_USER_PROFILE',
  USER_PROFILE_UPDATED: 'USER_PROFILE_UPDATED',

  QUERY_COMIC_INFOS_FROM_DATABASE: 'QUERY_COMIC_INFOS_FROM_DATABASE',
  QUERYING_COMIC_INFOS_FROM_DATABASE: 'QUERYING_COMIC_INFOS_FROM_DATABASE',
  COMIC_INFOS_FROM_DATABASE_QUERIED: 'COMIC_INFOS_FROM_DATABASE_QUERIED',

  UPDATING_COMIC_INFO_DATABASE: 'UPDATING_COMIC_INFO_DATABASE',
  COMIC_INFO_DATABASE_UPDATED: 'COMIC_INFO_DATABASE_UPDATED',

  CREATE_DOWNLOAD_TASK: 'CREATE_DOWNLOAD_TASK',
  CREATING_DOWNLOAD_TASK: 'CREATING_DOWNLOAD_TASK',
  DOWNLOAD_TASK_CREATED: 'DOWNLOAD_TASK_CREATED',

  DELETE_DOWNLOAD_TASK: 'DELETE_DOWNLOAD_TASK',
  DELETING_DOWNLOAD_TASK: 'DELETING_DOWNLOAD_TASK',
  DOWNLOAD_TASK_DELETED: 'DOWNLOAD_TASK_DELETED',

  QUERY_DOWNLOAD_TASKS: 'QUERY_DOWNLOAD_TASKS',
  QUERYING_DOWNLOAD_TASKS: 'QUERYING_DOWNLOAD_TASKS',
  DOWNLOAD_TASKS_QUERIED: 'DOWNLOAD_TASKS_QUERIED',

  DOWNLOADING_COMIC: 'DOWNLOADING_COMIC',
  COMIC_DOWNLOADED: 'COMIC_DOWNLOADED',

  SEARCH_COMIC: 'SEARCH_COMIC',
}

export const actions = {
  sendAppStartSignal: createAction(ActionTypes.SEND_APP_START_SIGNAL),

  changeCurrentPage: createAction(ActionTypes.CHANGE_CURRENT_PAGE),

  queryUserProfile: createAction(ActionTypes.QUERY_USER_PROFILE),
  queryingUserProfile: createAction(ActionTypes.QUERYING_USER_PROFILE),
  userProfileQueried: createAction(ActionTypes.USER_PROFILE_QUERIED),

  updateUserProfile: createAction(ActionTypes.UPDATE_USER_PROFILE),
  updatingUserProfile: createAction(ActionTypes.UPDATING_USER_PROFILE),
  userProfileUpdated: createAction(ActionTypes.USER_PROFILE_UPDATED),

  queryComicInfosFromDatabase: createAction(ActionTypes.QUERY_COMIC_INFOS_FROM_DATABASE),
  queryingComicInfosFromDatabase: createAction(ActionTypes.QUERYING_COMIC_INFOS_FROM_DATABASE),
  comicInfosFromDatabaseQueried: createAction(ActionTypes.COMIC_INFOS_FROM_DATABASE_QUERIED),

  updatingComicInfoDatabase: createAction(ActionTypes.UPDATING_COMIC_INFO_DATABASE),
  comicInfoDatabaseUpdated: createAction(ActionTypes.COMIC_INFO_DATABASE_UPDATED),

  createDownloadTask: createAction(ActionTypes.CREATE_DOWNLOAD_TASK),
  creatingDownloadTask: createAction(ActionTypes.CREATING_DOWNLOAD_TASK),
  downloadTaskCreated: createAction(ActionTypes.DOWNLOAD_TASK_CREATED),

  deleteDownloadTask: createAction(ActionTypes.DELETE_DOWNLOAD_TASK),
  deletingDownloadTask: createAction(ActionTypes.DELETING_DOWNLOAD_TASK),
  downloadTaskDeleted: createAction(ActionTypes.DOWNLOAD_TASK_DELETED),

  queryDownloadTasks: createAction(ActionTypes.QUERY_DOWNLOAD_TASKS),
  queryingDownloadTasks: createAction(ActionTypes.QUERYING_DOWNLOAD_TASKS),
  downloadTasksQueried: createAction(ActionTypes.DOWNLOAD_TASKS_QUERIED),

  downloadingComic: createAction(ActionTypes.DOWNLOADING_COMIC),
  comicDownloaded: createAction(ActionTypes.COMIC_DOWNLOADED),

  searchComic: createAction(ActionTypes.SEARCH_COMIC),
}

export const defaultState = {
  currentPage: Page.BROWSE_PAGE,

  comicInfo: {
    loading: false,
    allIds: [],
    byId: {},
  },

  downloadTask: {
    loading: false,
    allIds: [],
    byId: {},
  },

  userProfile: {
    downloadFolderPath: '',
  },
}

export const reducer = handleActions({
  [ActionTypes.CHANGE_CURRENT_PAGE]: (state, action) => ({
    ...state,
    currentPage: action.payload,
  }),
  [ActionTypes.USER_PROFILE_QUERIED]: (state, action) => ({
    ...state,
    userProfile: action.payload,
  }),
  [ActionTypes.USER_PROFILE_UPDATED]: (state, action) => ({
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
  [ActionTypes.DOWNLOAD_TASK_DELETED]: (state, action) => ({
    ...state,
    downloadTask: {
      loading: false,
      allIds: state.downloadTask.allIds.filter(downloadTaskId => downloadTaskId !== action.payload),
      byId: {
        ...state.downloadTask.byId,
        [action.payload]: undefined
      },
    },
  }),
  [ActionTypes.QUERYING_DOWNLOAD_TASKS]: (state) => ({
    ...state,
    downloadTask: {
      loading: true,
      allIds: [],
      byId: {},
    },
  }),
  [ActionTypes.DOWNLOAD_TASKS_QUERIED]: (state, action) => ({
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
}, defaultState)


const selectCurrentPage = state => state.currentPage

const selectUserProfile = state => state.userProfile

const selectLoadingComicInfos = state => state.comicInfo.loading

const selectComicInfos = state => state.comicInfo.allIds.map(id => state.comicInfo.byId[id])

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
  selectLoadingDownloadTaskInfos,
  selectDownloadTasks,
}
