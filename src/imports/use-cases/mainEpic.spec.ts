import 'reflect-metadata'

import {of} from 'rxjs'

import {actions} from '../app/ducks/mainDuck'
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
import DownloadTaskUpdatedEvent from '../domain/downloader/event/DownloadTaskUpdatedEvent'
import Config from '../domain/general/entities/Config'
import ConfigFactoryImpl from '../domain/general/factories/ConfigFactoryImpl'
import {ComicInfoRepository} from '../domain/library/interfaces/repositories'
import {SFComicInfoQueryAdapter} from '../domain/library/interfaces/adapters'
import ComicInfoFactoryImpl from '../domain/library/factories/ComicInfoFactoryImpl'
import DownloadTaskFactoryImpl from '../domain/downloader/factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../domain/downloader/interfaces/repositories'
import {SFComicDownloadAdapter} from '../domain/downloader/interfaces/adapters'


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
    const config = new Config(
      'comicsFolder'
    )

    const configRepository = {
      asyncGet: jest.fn(() => Promise.resolve(config)),
    }

    const actions$ = of(actions.queryConfig())
    const result = await queryConfigEpic(actions$, {}, {general: {configRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingConfig(),
      actions.configQueried(config.serialize()),
    ])
  })
})

describe('queryComicInfosFromDatabaseEpic', () => {
  it('will retrieve comic infos from database when getting query command', async () => {
    const comicInfoFactory = new ComicInfoFactoryImpl()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdated: 'lastUpdated-1',
        summary: 'summary-1',
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdated: 'lastUpdated-2',
        summary: 'summary-2',
      })
    ]

    const comicInfoInfoRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const actions$ = of(actions.queryComicInfosFromDatabase())
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {library: {comicInfoInfoRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos.map(comicInfo => comicInfo.serialize())),
    ])
  })

  it('will retrieve comic infos from database when database updated', async () => {
    const comicInfoFactory = new ComicInfoFactoryImpl()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdated: 'lastUpdated-1',
        summary: 'summary-1',
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdated: 'lastUpdated-2',
        summary: 'summary-2',
      })
    ]

    const comicInfoInfoRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const actions$ = of(actions.comicInfoDatabaseUpdated())
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {library: {comicInfoInfoRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos.map(comicInfo => comicInfo.serialize())),
    ])
  })

  it('will retrieve comic infos by search term from database', async () => {
    const comicInfoFactory = new ComicInfoFactoryImpl()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdated: 'lastUpdated-1',
        summary: 'summary-1',
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdated: 'lastUpdated-2',
        summary: 'summary-2',
      })
    ]

    const comicInfoInfoRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const actions$ = of(actions.searchComic('search term'))
    const result = await queryComicInfosFromDatabaseEpic(actions$, {}, {library: {comicInfoInfoRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(comicInfoInfoRepository.asyncGetAllBySearchTerm).toBeCalledWith('search term')

    expect(result).toEqual([
      actions.queryingComicInfosFromDatabase(),
      actions.comicInfosFromDatabaseQueried(comicInfos.map(comicInfo => comicInfo.serialize())),
    ])
  })
})


describe('queryDownloadTasksEpic', () => {
  it('will retrieve download tasks from database', async () => {
    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }
    const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)

    const downloadTasks = [
      downloadTaskFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        sourceUrl: 'sourceUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        sourceUrl: 'sourceUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.queryDownloadTasks())
    const result = await queryDownloadTasksEpic(actions$, {}, {downloader: {downloadTaskRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks.map(downloadTask => downloadTask.serialize())),
    ])
  })

  it('will retrieve download tasks again after a new download task created', async () => {
    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }
    const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)

    const downloadTasks = [
      downloadTaskFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        sourceUrl: 'sourceUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        sourceUrl: 'sourceUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.downloadTaskCreated())
    const result = await queryDownloadTasksEpic(actions$, {}, {downloader: {downloadTaskRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks.map(downloadTask => downloadTask.serialize())),
    ])
  })

  it('will retrieve download tasks again after a new download task downloaded', async () => {
    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }
    const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)

    const downloadTasks = [
      downloadTaskFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        sourceUrl: 'sourceUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        sourceUrl: 'sourceUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.comicDownloaded())
    const result = await queryDownloadTasksEpic(actions$, {}, {downloader: {downloadTaskRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.queryingDownloadTasks(),
      actions.downloadTasksQueried(downloadTasks.map(downloadTask => downloadTask.serialize())),
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
    const comicInfoFactory = new ComicInfoFactoryImpl()
    const comicInfo = comicInfoFactory.createFromJson({
      id: 'id-1',
      name: 'name-1',
      coverDataUrl: 'coverDataUrl-1',
      source: 'source-1',
      pageUrl: 'pageUrl-1',
      catalog: 'catalog-1',
      author: 'author-1',
      lastUpdated: 'lastUpdated-1',
      summary: 'summary-1',
    })

    const comicInfoInfoRepository: ComicInfoRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGetById: jest.fn(),
      asyncGetAllBySearchTerm: jest.fn(),
    }
    const sfComicInfoQueryAdapter: SFComicInfoQueryAdapter = {
      asyncGetComicInfos: jest.fn(() => Promise.resolve([comicInfo])),
    }

    const actions$ = of(actions.comicInfosFromDatabaseQueried([]))
    const result = await updateComicInfoDatabaseEpic(actions$, {}, {
      library: {
        comicInfoInfoRepository,
        sfComicInfoQueryAdapter
      }
    }).pipe(
      toArray(),
    ).toPromise()

    expect(sfComicInfoQueryAdapter.asyncGetComicInfos).toBeCalled()
    expect(comicInfoInfoRepository.asyncSaveOrUpdate).toBeCalledWith(comicInfo)

    expect(result).toEqual([
      actions.updatingComicInfoDatabase(),
      actions.comicInfoDatabaseUpdated(),
    ])
  })
})

describe('createDownloadTaskEpic', () => {
  it('will create download task by id', async () => {

    const comicInfoFactory = new ComicInfoFactoryImpl()
    const comicInfo = comicInfoFactory.createFromJson({
      id: 'id',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
      source: 'source',
      pageUrl: 'pageUrl',
      catalog: 'catalog',
      author: 'author',
      lastUpdated: 'lastUpdated',
      summary: 'summary',
    })

    const comicInfoInfoRepository: ComicInfoRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGetById: jest.fn(() => Promise.resolve(comicInfo)),
      asyncGetAllBySearchTerm: jest.fn(),
    }

    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)

    const downloadTask = downloadTaskFactory.createFromJson({
      id: comicInfo.identity,
      name: comicInfo.name,
      coverDataUrl: comicInfo.coverDataUrl,
      sourceUrl: comicInfo.pageUrl,
    })

    const actions$ = of(actions.createDownloadTask(comicInfo.identity))
    const result = await createDownloadTaskEpic(actions$, {}, {
      library: {comicInfoInfoRepository},
      downloader: {downloadTaskFactory, downloadTaskRepository}
    }).pipe(
      toArray(),
    ).toPromise()

    expect(comicInfoInfoRepository.asyncGetById).toBeCalledWith(comicInfo.identity)
    expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTask)

    expect(result).toEqual([
      actions.creatingDownloadTask(),
      actions.downloadTaskCreated(downloadTask.serialize()),
    ])
  })
})


describe('deleteDownloadTaskEpic', () => {
  it('will delete download task by id', async () => {
    const downloadTaskId = 'downloadTaskId'

    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const actions$ = of(actions.deleteDownloadTask(downloadTaskId))
    const result = await deleteDownloadTaskEpic(actions$, {}, {downloader: {downloadTaskRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(downloadTaskRepository.delete).toBeCalledWith(downloadTaskId)

    expect(result).toEqual([
      actions.deletingDownloadTask(),
      actions.downloadTaskDeleted(downloadTaskId),
    ])
  })
})


describe('handleDownloadTaskEpic', () => {
  it('will handle delete download tasks after a download created', async () => {
    const downloadTaskRepository: DownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)

    const downloadTask = downloadTaskFactory.createFromJson({
      id: 'id',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
      sourceUrl: 'sourceUrl',
    })
    downloadTaskRepository.getById = jest.fn(() => downloadTask)

    const sfComicDownloadAdapter: SFComicDownloadAdapter = {
      asyncDownload: jest.fn(),
    }

    const actions$ = of(actions.downloadTaskCreated(downloadTask))
    const result = await handleDownloadTaskEpic(actions$, {}, {
      downloader: {
        downloadTaskRepository,
        sfComicDownloadAdapter
      }
    }).pipe(
      toArray(),
    ).toPromise()

    expect(sfComicDownloadAdapter.asyncDownload).toBeCalledWith(downloadTask)

    expect(result).toEqual([
      actions.downloadingComic(),
      actions.comicDownloaded(),
    ])
  })
})

describe('updateConfigEpic', () => {
  it('will update configuration from database', async () => {
    const configData = {
      downloadFolderPath: 'downloadFolderPath',
    }

    const configFactory = new ConfigFactoryImpl()

    const configRepository = {
      asyncSaveOrUpdate: jest.fn()
    }

    const actions$ = of(actions.updateConfig(configData))
    const result = await updateConfigEpic(actions$, {}, {general: {configFactory, configRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(configRepository.asyncSaveOrUpdate).toBeCalledWith(configFactory.createFromJson(configData))

    expect(result).toEqual([
      actions.updatingConfig(),
      actions.configUpdated(configData),
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
