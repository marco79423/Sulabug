import {createReducer, PayloadAction} from '@reduxjs/toolkit'

import {IBrowserState, IComic, IProfile, IDownloadTask} from './interface'
import * as actions from './actions'

const initialState: IBrowserState = {
  comics: {
    loading: false,
    data: [],
  },
  downloadTasks: {
    loading: false,
    data: [],
  },
  config: {
    loading: false,
    data: {}
  },
}


export default createReducer(
  initialState,
  builder => builder
    // queryComics
    .addCase(actions.queryComicsProcessing, (state) => ({
      ...state,
      comics: {
        loading: true,
        data: [],
      }
    }))
    .addCase(actions.queryComicsSuccess, (state, action: PayloadAction<IComic[]>) => ({
      ...state,
      comics: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(actions.queryComicsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      comics: {
        loading: false,
        data: [],
      },
    }))
    // addComicToCollection
    .addCase(actions.addComicToCollectionsProcessing, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              state: 'loading',
            }
          }
          return comic
        })
      }
    }))
    .addCase(actions.addComicToCollectionsSuccess, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              inCollection: true,
              state: 'ready',
            }
          }
          return comic
        })
      },
    }))
    .addCase(actions.addComicToCollectionsFailure, (state, action: PayloadAction<{ id: number, error: Error }>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload.id) {
            return {
              ...comic,
              state: 'ready',
            }
          }
          return comic
        })
      },
    }))
    // removeComicFromCollection
    .addCase(actions.removeComicFromCollectionsProcessing, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              state: 'loading',
            }
          }
          return comic
        })
      }
    }))
    .addCase(actions.removeComicFromCollectionsSuccess, (state, action: PayloadAction<number>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload) {
            return {
              ...comic,
              inCollection: false,
              state: 'ready',
            }
          }
          return comic
        })
      },
    }))
    .addCase(actions.removeComicFromCollectionsFailure, (state, action: PayloadAction<{ id: number, error: Error }>) => ({
      ...state,
      comics: {
        ...state.comics,
        data: state.comics.data.map(comic => {
          if (comic.id === action.payload.id) {
            return {
              ...comic,
              state: 'ready',
            }
          }
          return comic
        })
      },
    }))
    // queryConfig
    .addCase(actions.queryConfigProcessing, (state) => ({
      ...state,
      config: {
        loading: true,
        data: {},
      }
    }))
    .addCase(actions.queryConfigSuccess, (state, action: PayloadAction<IProfile>) => ({
      ...state,
      config: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(actions.queryConfigFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      config: {
        loading: false,
        data: {},
        error: action.payload,
      }
    }))
    // updateConfig
    .addCase(actions.updateConfigProcessing, (state) => ({
      ...state,
      config: {
        loading: true,
        data: {}
      },
    }))
    .addCase(actions.updateConfigSuccess, (state, action: PayloadAction<IProfile>) => ({
      ...state,
      config: {
        loading: false,
        data: action.payload,
      },
    }))
    .addCase(actions.updateConfigFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      config: {
        loading: false,
        data: {},
      },
    }))
    // updateDatabase
    .addCase(actions.updateDatabaseProcessing, (state) => ({
      ...state,
      comics: {
        loading: true,
        data: [],
      }
    }))
    .addCase(actions.updateDatabaseSuccess, (state, action: PayloadAction<IComic[]>) => ({
      ...state,
      comics: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(actions.updateDatabaseFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      comics: {
        loading: false,
        data: [],
      },
    }))
    // createDownloadTasks
    .addCase(actions.createDownloadTasksFromCollectionsSuccess, (state, action: PayloadAction<IDownloadTask[]>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: action.payload,
      }
    }))
    // handleDownloadTask
    .addCase(actions.handleDownloadTaskProcessing, (state, action: PayloadAction<IDownloadTask>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: state.downloadTasks.data
          .filter(downloadTask => downloadTask.comicId !== action.payload.comicId || (downloadTask.comicId === action.payload.comicId && action.payload.state !== 'Finished'))
          .map(downloadTask => {
            if (downloadTask.comicId === action.payload.comicId) {
              return {
                ...downloadTask,
                ...action.payload,
              }
            }
            return downloadTask
          }),
      }
    }))
)
