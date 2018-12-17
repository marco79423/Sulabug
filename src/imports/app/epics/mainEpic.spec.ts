import 'reflect-metadata'

import {of} from 'rxjs'

import {Request, Response} from '../../domain/base-types'
import {actions} from '../ducks/mainDuck'
import {
  changeCurrentPageEpic,
  createDownloadTaskEpic,
  deleteDownloadTaskEpic,
  handleDownloadTaskEpic,
  handleDownloadTaskUpdatedEventEpic,
  queryComicInfosFromDatabaseEpic,
  queryConfigEpic,
  queryDownloadTasksEpic,
  updateComicInfoDatabaseEpic,
  updateConfigEpic
} from './mainEpic'
import {toArray} from 'rxjs/operators'
import DownloadTaskUpdatedEvent from '../../domain/downloader/event/DownloadTaskUpdatedEvent'


describe('initializeEpic', () => {
  it('will start actions automatically in the beginning', async () => {
    const result = await initializeEpic().pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryConfig(),
      actions.queryComicInfosFromDatabase(),
      actions.queryDownloadTasks(),
    ])
  })
})

export const initializeEpic = () => of(
  actions.queryConfig(),
  actions.queryComicInfosFromDatabase(),
  actions.queryDownloadTasks(),
)

describe('queryConfigEpic', () => {
  it('will retrieve config from database', async () => {
    const config = {}

    const queryConfigUseCase = {
      execute: jest.fn(() => of(new Response(config))),
    }

    const actions$ = of(actions.queryConfig())
    const result = await queryConfigEpic(actions$, {}, {queryConfigUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingConfig(),
      actions.configQueried(config),
    ])
  })
})

describe('queryComicInfosFromDatabaseEpic', () => {
  it('will retrieve comic infos from database when getting query command', async () => {
    const comicInfos = []

    const queryComicInfosFromDatabaseUseCase = {
      execute: jest.fn(() => of(new Response(comicInfos))),
    }

    const actions$ = of(actions.queryComicInfosFromDatabase())
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {queryComicInfosFromDatabaseUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos),
    ])
  })

  it('will retrieve comic infos from database when database updated', async () => {
    const comicInfos = []

    const queryComicInfosFromDatabaseUseCase = {
      execute: jest.fn(() => of(new Response(comicInfos))),
    }

    const actions$ = of(actions.comicInfoDatabaseUpdated())
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {queryComicInfosFromDatabaseUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos),
    ])
  })

  it('will retrieve comic infos by search term from database', async () => {
    const comicInfos = {}

    const queryComicInfosFromDatabaseUseCase = {
      execute: jest.fn(() => of(new Response(comicInfos))),
    }

    const actions$ = of(actions.searchComic('search term'))
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {queryComicInfosFromDatabaseUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(queryComicInfosFromDatabaseUseCase.execute).toBeCalledWith(new Request('search term'))

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos),
    ])
  })
})


describe('queryDownloadTasksEpic', () => {
  it('will retrieve download tasks from database', async () => {
    const downloadTasks = {}

    const queryDownloadTasksUseCase = {
      execute: jest.fn(() => of(new Response(downloadTasks))),
    }

    const actions$ = of(actions.queryDownloadTasks())
    const result = await queryDownloadTasksEpic(actions$, {}, {queryDownloadTasksUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks),
    ])
  })

  it('will retrieve download tasks again after a new download task created', async () => {
    const downloadTasks = {}

    const queryDownloadTasksUseCase = {
      execute: jest.fn(() => of(new Response(downloadTasks))),
    }

    const actions$ = of(actions.downloadTaskCreated())
    const result = await queryDownloadTasksEpic(actions$, {}, {queryDownloadTasksUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks),
    ])
  })

  it('will retrieve download tasks again after a new download task downloaded', async () => {
    const downloadTasks = {}

    const queryDownloadTasksUseCase = {
      execute: jest.fn(() => of(new Response(downloadTasks))),
    }

    const actions$ = of(actions.comicDownloaded())
    const result = await queryDownloadTasksEpic(actions$, {}, {queryDownloadTasksUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks),
    ])
  })
})


describe('changeCurrentPageEpic', () => {
  it('will change page by actions', async () => {
    const actions$ = of(actions.changeCurrentPage('a'))
    const result = await changeCurrentPageEpic(actions$).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.currentPageChanged('a'),
    ])
  })
})

describe('updateComicInfoDatabaseEpic', () => {
  it('will update database from network automatically when the result of querying comic infos is empty', async () => {
    const updateComicInfoDatabaseUseCase = {
      execute: jest.fn(() => of(new Response())),
    }

    const actions$ = of(actions.comicInfosFromDatabaseQueried([]))
    const result = await updateComicInfoDatabaseEpic(actions$, {}, {updateComicInfoDatabaseUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(updateComicInfoDatabaseUseCase.execute).toBeCalled()

    expect(result).toEqual([
      actions.updatingComicInfoDatabase(),
      actions.comicInfoDatabaseUpdated(),
    ])
  })
})

describe('createDownloadTaskEpic', () => {
  it('will create download task by id', async () => {
    const downloadTask = {}

    const createDownloadTaskUseCase = {
      execute: jest.fn(() => of(new Response(downloadTask))),
    }

    const actions$ = of(actions.createDownloadTask('comicInfoId'))
    const result = await createDownloadTaskEpic(actions$, {}, {createDownloadTaskUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(createDownloadTaskUseCase.execute).toBeCalledWith(new Request('comicInfoId'))

    expect(result).toEqual([
      actions.creatingDownloadTask(),
      actions.downloadTaskCreated(downloadTask),
    ])
  })
})


describe('deleteDownloadTaskEpic', () => {
  it('will delete download task by id', async () => {
    const downloadTaskId = 'downloadTaskId'

    const deleteDownloadTaskUseCase = {
      execute: jest.fn(() => of(new Response())),
    }

    const actions$ = of(actions.deleteDownloadTask(downloadTaskId))
    const result = await deleteDownloadTaskEpic(actions$, {}, {deleteDownloadTaskUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(deleteDownloadTaskUseCase.execute).toBeCalledWith(new Request(downloadTaskId))

    expect(result).toEqual([
      actions.deletingDownloadTask(),
      actions.downloadTaskDeleted(downloadTaskId),
    ])
  })
})


describe('handleDownloadTaskEpic', () => {
  it('will handle delete download tasks after a download created', async () => {
    const downloadTask = {
      id: 'downloadTaskId'
    }

    const downloadComicUseCase = {
      execute: jest.fn(() => of(new Response())),
    }

    const actions$ = of(actions.downloadTaskCreated(downloadTask))
    const result = await handleDownloadTaskEpic(actions$, {}, {downloadComicUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(downloadComicUseCase.execute).toBeCalledWith(new Request(downloadTask.id))

    expect(result).toEqual([
      actions.downloadingComic(),
      actions.comicDownloaded(),
    ])
  })
})

describe('updateConfigEpic', () => {
  it('will update configuration from database', async () => {
    const config = {}

    const updateConfigUseCase = {
      execute: jest.fn(() => of(new Response())),
    }

    const actions$ = of(actions.updateConfig(config))
    const result = await updateConfigEpic(actions$, {}, {updateConfigUseCase}).pipe(
      toArray(),
    ).toPromise()

    expect(updateConfigUseCase.execute).toBeCalledWith(new Request(config))

    expect(result).toEqual([
      actions.updatingConfig(),
      actions.configUpdated(config),
    ])
  })
})

describe('handleDownloadTaskUpdatedEventEpic', () => {
  it('will handle download task updated events', async () => {
    const eventPublisher = {
      getEventStream: jest.fn(() => of(new DownloadTaskUpdatedEvent())),
    }

    const actions$ = of()
    const result = await handleDownloadTaskUpdatedEventEpic(actions$, {}, {eventPublisher}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryDownloadTasks(),
    ])
  })
})
