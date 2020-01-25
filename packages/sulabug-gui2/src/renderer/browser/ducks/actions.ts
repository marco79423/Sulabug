import {createAction} from '@reduxjs/toolkit'
import {ICollection, IComic, IConfig, IDownloadTask} from './interface'

export const queryComicsRequest = createAction('browser/queryComics/request')
export const queryComicsProcessing = createAction('browser/queryComics/processing')
export const queryComicsSuccess = createAction<IComic[]>('browser/queryComics/success')
export const queryComicsFailure = createAction<Error>('browser/queryComics/failure')

export const queryCollectionsRequest = createAction('browser/queryCollections/request')
export const queryCollectionsProcessing = createAction('browser/queryCollections/processing')
export const queryCollectionsSuccess = createAction<ICollection[]>('browser/queryCollections/success')
export const queryCollectionsFailure = createAction<Error>('browser/queryCollections/failure')

export const addComicToCollectionsRequest = createAction<number>('browser/addComicToCollections/request')
export const addComicToCollectionsProcessing = createAction('browser/addComicToCollections/processing')
export const addComicToCollectionsSuccess = createAction<number>('browser/addComicToCollections/success')
export const addComicToCollectionsFailure = createAction<Error>('browser/addComicToCollections/failure')

export const removeComicFromCollectionsRequest = createAction<number>('browser/removeComicFromCollections/request')
export const removeComicFromCollectionsProcessing = createAction('browser/removeComicFromCollections/processing')
export const removeComicFromCollectionsSuccess = createAction<number>('browser/removeComicFromCollections/success')
export const removeComicFromCollectionsFailure = createAction<Error>('browser/removeComicFromCollections/failure')

export const queryConfigRequest = createAction('browser/queryConfig/request')
export const queryConfigProcessing = createAction('browser/queryConfig/processing')
export const queryConfigSuccess = createAction<IConfig>('browser/queryConfig/success')
export const queryConfigFailure = createAction<Error>('browser/queryConfig/failure')

export const updateConfigRequest = createAction<IConfig>('browser/updateConfig/request')
export const updateConfigProcessing = createAction('browser/updateConfig/processing')
export const updateConfigSuccess = createAction<IConfig>('browser/updateConfig/success')
export const updateConfigFailure = createAction<Error>('browser/updateConfig/failure')

export const updateDatabaseRequest = createAction('browser/updateDatabase/request')
export const updateDatabaseProcessing = createAction('browser/updateDatabase/processing')
export const updateDatabaseSuccess = createAction<IComic[]>('browser/updateDatabase/success')
export const updateDatabaseFailure = createAction<Error>('browser/updateDatabase/failure')

export const createDownloadTasksFromCollectionsRequest = createAction('browser/createDownloadTasksFromCollections/request')
export const createDownloadTasksFromCollectionsProcessing = createAction('browser/createDownloadTasksFromCollections/processing')
export const createDownloadTasksFromCollectionsSuccess = createAction<IDownloadTask[]>('browser/createDownloadTasksFromCollections/success')
export const createDownloadTasksFromCollectionsFailure = createAction<Error>('browser/createDownloadTasksFromCollections/failure')

export const updateDownloadTaskStatus = createAction<{ id: number, state: string, progress: number, status: string }>('browser/updateDownloadTaskStatus')
