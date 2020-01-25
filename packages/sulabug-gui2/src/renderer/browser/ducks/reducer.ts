import {createReducer, PayloadAction} from '@reduxjs/toolkit'

import {IBrowserState, IConfig} from './interface'
import * as actions from './actions'

const initialState: IBrowserState = {
  comics: {
    loading: false,
    data: [],
  },
  collections: {
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
  asyncTasks: {
    addComicToCollections: {
      loading: false,
    },
    removeComicFromCollections: {
      loading: false,
    },
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
    .addCase(actions.queryComicsSuccess, (state, action: PayloadAction<any[]>) => ({
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
        error: action.payload,
      }
    }))
    .addCase(actions.queryCollectionsProcessing, (state) => ({
      ...state,
      collections: {
        loading: true,
        data: [],
      }
    }))
    .addCase(actions.queryCollectionsSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      collections: {
        loading: false,
        data: action.payload,
      }
    }))
    .addCase(actions.queryCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      collections: {
        loading: false,
        data: [],
        error: action.payload,
      }
    }))
    // addComicToCollection
    .addCase(actions.addComicToCollectionsProcessing, (state) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: true,
        },
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
            }
          }
          return comic
        })
      },
      collections: {
        ...state.collections,
        data: [...state.collections.data, ...state.comics.data.filter(comic => comic.id === action.payload)],
      },
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: false,
        },
      }
    }))
    .addCase(actions.addComicToCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        addComicToCollection: {
          loading: false,
          error: action.payload,
        },
      }
    }))
    // removeComicFromCollection
    .addCase(actions.removeComicFromCollectionsProcessing, (state) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: true,
        },
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
            }
          }
          return comic
        })
      },
      collections: {
        ...state.collections,
        data: state.collections.data.filter(collection => collection.id !== action.payload),
      },
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: false,
        },
      }
    }))
    .addCase(actions.removeComicFromCollectionsFailure, (state, action: PayloadAction<Error>) => ({
      ...state,
      asyncTasks: {
        ...state.asyncTasks,
        removeComicFromCollection: {
          loading: false,
          error: action.payload,
        },
      }
    }))
    // queryConfig
    .addCase(actions.queryConfigProcessing, (state) => ({
      ...state,
      config: {
        loading: true,
        data: {},
      }
    }))
    .addCase(actions.queryConfigSuccess, (state, action: PayloadAction<IConfig>) => ({
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
    .addCase(actions.updateConfigSuccess, (state, action: PayloadAction<IConfig>) => ({
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
        error: action.payload,
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
    .addCase(actions.updateDatabaseSuccess, (state, action: PayloadAction<any[]>) => ({
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
        error: action.payload,
      }
    }))
    // createDownloadTasks
    .addCase(actions.createDownloadTasksFromCollectionsSuccess, (state, action: PayloadAction<any[]>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: action.payload,
      }
    }))
    // updateDownloadTasks
    .addCase(actions.updateDownloadTaskStatus, (state, action: PayloadAction<{ id: number, state: string, progress: number, status: string }>) => ({
      ...state,
      downloadTasks: {
        loading: false,
        data: state.downloadTasks.data
          .filter(downloadTask => downloadTask.id !== action.payload.id || (downloadTask.id === action.payload.id && action.payload.state !== 'Finished'))
          .map(downloadTask => {
            if (downloadTask.id === action.payload.id) {
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
