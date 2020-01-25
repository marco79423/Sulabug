import {createSelector} from '@reduxjs/toolkit'

export const isComicsLoading = state => state.browser.comics.loading
export const getComics = state => state.browser.comics.data
export const getComicIds = createSelector(
  getComics,
  comics => comics.map(comic => comic.id),
)
export const getComicMap = createSelector(
  getComics,
  comics => comics.reduce((comicMap, comic) => ({
    ...comicMap,
    [comic.id]: comic,
  }), {})
)
export const isCollectionsLoading = state => state.browser.collections.loading
export const getCollections = state => state.browser.collections.data
export const getCollectionIds = createSelector(
  getCollections,
  collections => collections.map(collection => collection.id),
)
export const getCollectionMap = createSelector(
  getCollections,
  collections => collections.reduce((collectionMap, collection) => ({
    ...collectionMap,
    [collection.id]: collection,
  }), {})
)
export const getDownloadTasks = state => state.browser.downloadTasks.data
export const getDownloadTaskIds = createSelector(
  getDownloadTasks,
  downloadTasks => downloadTasks.map(downloadTask => downloadTask.id),
)
export const getDownloadTaskMap = createSelector(
  getDownloadTasks,
  downloadTasks => downloadTasks.reduce((downloadTaskMap, downloadTask) => ({
    ...downloadTaskMap,
    [downloadTask.id]: downloadTask,
  }), {})
)
export const isConfigLoading = state => state.browser.config.loading
export const getConfig = state => state.browser.config.data
