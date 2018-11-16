import {createAction, handleActions} from 'redux-actions'
import {createSelector} from 'reselect'

export const Page = {
  BROWSE_PAGE: 'BROWSE_PAGE',
  DOWNLOAD_PAGE: 'DOWNLOAD_PAGE',
  SETTINGS_PAGE: 'SETTINGS_PAGE',
}

export const ActionTypes = {
  CHANGE_CURRENT_PAGE: 'CHANGE_CURRENT_PAGE',
  CHANGING_CURRENT_PAGE: 'CHANGING_CURRENT_PAGE',
  CURRENT_PAGE_CHANGED: 'CURRENT_PAGE_CHANGED',

  QUERY_CONFIG: 'QUERY_CONFIG',
  QUERYING_CONFIG: 'QUERYING_CONFIG',
  CONFIG_QUERIED: 'CONFIG_QUERIED',

  UPDATE_CONFIG: 'UPDATE_CONFIG',
  UPDATING_CONFIG: 'UPDATING_CONFIG',
  CONFIG_UPDATED: 'CONFIG_UPDATED',

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
  changeCurrentPage: createAction(ActionTypes.CHANGE_CURRENT_PAGE),
  changingCurrentPage: createAction(ActionTypes.CHANGING_CURRENT_PAGE),
  currentPageChanged: createAction(ActionTypes.CURRENT_PAGE_CHANGED),

  queryConfig: createAction(ActionTypes.QUERY_CONFIG),
  queryingConfig: createAction(ActionTypes.QUERYING_CONFIG),
  configQueried: createAction(ActionTypes.CONFIG_QUERIED),

  updateConfig: createAction(ActionTypes.UPDATE_CONFIG),
  updatingConfig: createAction(ActionTypes.UPDATING_CONFIG),
  configUpdated: createAction(ActionTypes.CONFIG_UPDATED),

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

  config: {
    comicsFolder: '',
    comicInfoStorePath: '',
  },
}

export const reducer = handleActions({
  [ActionTypes.CURRENT_PAGE_CHANGED]: (state, action) => ({
    ...state,
    currentPage: action.payload,
  }),
  [ActionTypes.CONFIG_QUERIED]: (state, action) => ({
    ...state,
    config: action.payload,
  }),
  [ActionTypes.CONFIG_UPDATED]: (state, action) => ({
    ...state,
    config: action.payload,
  }),
  [ActionTypes.QUERYING_COMIC_INFOS_FROM_DATABASE]: (state) => ({
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

const selectConfig = state => state.config

const selectLoadingComicInfos = state => state.comicInfo.loading

const selectComicInfos = state => state.comicInfo.allIds.map(id => state.comicInfo.byId[id])

const selectComicInfoMap = state => state.comicInfo.byId

const selectLoadingDownloadTasks = state => state.downloadTask.loading

const selectLoadingDownloadTaskInfos = createSelector(
  [
    selectLoadingComicInfos,
    selectLoadingDownloadTasks,
  ],
  (loadingComicInfos, loadingDownloadTask) => loadingComicInfos || loadingDownloadTask
)

const selectDownloadTasks = state => state.downloadTask.allIds.map(id => state.downloadTask.byId[id])

const selectDownloadTaskInfos = createSelector(
  [
    selectDownloadTasks,
    selectComicInfoMap,
  ],
  (downloadTasks, comicInfoMap) => {
    return downloadTasks.map(downloadTask => {
      const comicInfo = comicInfoMap[downloadTask.comicInfoId]
      return {
        id: downloadTask.id,
        coverImage: comicInfo.coverImage,
        name: comicInfo.name,
        status: downloadTask.status,
        progress: downloadTask.progress,
      }
    })
  }
)

export const selectors = {
  selectCurrentPage,
  selectConfig,
  selectLoadingComicInfos,
  selectComicInfos,
  selectLoadingDownloadTaskInfos,
  selectDownloadTaskInfos,
}
