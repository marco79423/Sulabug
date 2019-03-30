import 'reflect-metadata'

import {of} from 'rxjs'

import {actions} from '../ducks/mainDuck'
import {
  createDownloadTaskEpic,
  initializeDataFromDBWhenAppStartsEpic,
  searchComicInfosEpic,
  sendSignalWhenComicInfoDBIsEmptyEpic,
  startToDownloadComicWhenNewDownloadTaskCreatedEpic,
  syncDownloadTasksToStateWhenDownloadStatusChanged,
  transformDownloadTaskUpdatedEventToSignalEpic,
  updateComicInfoDBWhenDBIsEmptyEpic,
  updateUserProfileEpic
} from './mainEpic'
import {toArray} from 'rxjs/operators'
import DownloadTaskUpdatedEvent from '../../domain/event/DownloadTaskUpdatedEvent'
import UserProfile from '../../domain/entities/UserProfile'
import UserProfileFactory from '../../domain/factories/UserProfileFactory'
import {
  IComicInfoDatabaseService,
  IComicInfoRepository,
  IDownloadComicService,
  IDownloadTaskRepository,
  IUserProfileRepository
} from '../../domain/interfaces'
import ComicInfoFactory from '../../domain/factories/ComicInfoFactory'
import DownloadTaskFactory from '../../domain/factories/DownloadTaskFactory'
import ComicFactory from '../../domain/factories/ComicFactory'

describe('initializeDataFromDBWhenAppStartsEpic', () => {
  it('will query init data from database and then sync to state in the beginning', async () => {
    const userProfile = new UserProfile(
      'comicsFolder'
    )

    const userProfileRepository: IUserProfileRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGet: jest.fn(() => Promise.resolve(userProfile)),
    }

    const comicInfoFactory = new ComicInfoFactory()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdatedChapter: 'lastUpdatedChapter-1',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary-1',
        chapters: [],
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdatedChapter: 'lastUpdatedChapter-2',
        lastUpdatedTime: '2019-01-17T00:00:00.000Z',
        summary: 'summary-2',
        chapters: [],
      })
    ]

    const comicInfoInfoRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({comicInfoIdentity: "comicInfoIdentity-1"}),
      comicFactory.createFromJson({comicInfoIdentity: "comicInfoIdentity-2"}),
    ]
    const comicRepository = {
      asyncGetAll: jest.fn(() => Promise.resolve(comics))
    }

    const downloadTaskRepository: IDownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }
    const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)

    const downloadTasks = [
      downloadTaskFactory.createFromJson({
        id: 'id-1',
        comicInfoId: 'comicInfoId-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        comicInfoId: 'comicInfoId-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.sendAppStartSignal())
    const result = await initializeDataFromDBWhenAppStartsEpic(actions$, {}, {
      general: {userProfileRepository},
      library: {comicInfoInfoRepository},
      collection: {comicRepository},
      downloader: {downloadTaskRepository}
    }).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.waitForQueryingInitDataFromDB(),
      actions.syncInitDataToState({
        userProfile: userProfile.serialize(),
        comicInfos: comicInfos.map(comicInfo => comicInfo.serialize()),
        comics: comics.map(comic => comic.serialize()),
        downloadTasks: downloadTasks.map(downloadTask => downloadTask.serialize()),
      }),
    ])
  })
})


describe('sendSignalWhenComicInfoDBIsEmptyEpic', () => {
  it('will do nothing when db is not empty', async () => {
    const comicInfoFactory = new ComicInfoFactory()
    const comicInfo = comicInfoFactory.createFromJson({
      id: 'id',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
      source: 'source',
      pageUrl: 'pageUrl',
      catalog: 'catalog',
      author: 'author',
      lastUpdatedChapter: 'lastUpdatedChapter',
      lastUpdatedTime: '2019-01-16T00:00:00.000Z',
      summary: 'summary',
      chapters: [],
    })

    const actions$ = of(actions.syncInitDataToState({
      userProfile: {},
      comicInfos: [comicInfo.serialize()],
      downloadTasks: []
    }))
    const result = await sendSignalWhenComicInfoDBIsEmptyEpic(actions$).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([])
  })

  it('will send signal when db is empty', async () => {
    const actions$ = of(actions.syncInitDataToState({userProfile: {}, comicInfos: [], downloadTasks: []}))
    const result = await sendSignalWhenComicInfoDBIsEmptyEpic(actions$).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.sendComicInfoDatabaseEmptySignal()
    ])
  })
})

describe('updateComicInfoDBWhenDBIsEmptyEpic', () => {
  it('will update database from network and sync to state when db is empty', async () => {
    const comicInfoFactory = new ComicInfoFactory()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdatedChapter: 'lastUpdatedChapter-1',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary-1',
        chapters: [],
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdatedChapter: 'lastUpdatedChapter-2',
        lastUpdatedTime: '2019-01-17T00:00:00.000Z',
        summary: 'summary-2',
        chapters: [],
      })
    ]

    const comicInfoDatabaseService: IComicInfoDatabaseService = {
      asyncUpdateAndReturn: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const actions$ = of(actions.sendComicInfoDatabaseEmptySignal())
    const result = await updateComicInfoDBWhenDBIsEmptyEpic(actions$, {}, {library: {comicInfoDatabaseService}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.waitForComicInfoDatabaseUpdate(),
      actions.syncComicInfosToState(comicInfos.map(comicInfo => comicInfo.serialize())),
    ])
  })
})

describe('searchComicInfosEpic', () => {
  it('will search comic infos by search term from database', async () => {
    const comicInfoFactory = new ComicInfoFactory()
    const comicInfos = [
      comicInfoFactory.createFromJson({
        id: 'id-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
        source: 'source-1',
        pageUrl: 'pageUrl-1',
        catalog: 'catalog-1',
        author: 'author-1',
        lastUpdatedChapter: 'lastUpdatedChapter-1',
        lastUpdatedTime: '2019-01-16T00:00:00.000Z',
        summary: 'summary-1',
        chapters: [],
      }),
      comicInfoFactory.createFromJson({
        id: 'id-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
        source: 'source-2',
        pageUrl: 'pageUrl-2',
        catalog: 'catalog-2',
        author: 'author-2',
        lastUpdatedChapter: 'lastUpdatedChapter-2',
        lastUpdatedTime: '2019-01-17T00:00:00.000Z',
        summary: 'summary-2',
        chapters: [],
      })
    ]

    const comicInfoInfoRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comicInfos)),
    }

    const actions$ = of(actions.searchComic('search term'))
    const result = await searchComicInfosEpic(actions$, {}, {library: {comicInfoInfoRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(comicInfoInfoRepository.asyncGetAllBySearchTerm).toBeCalledWith('search term')

    expect(result).toEqual([
      actions.waitForResultOfSearchingComicInfosFromDB(),
      actions.syncComicInfosToState(comicInfos.map(comicInfo => comicInfo.serialize())),
    ])
  })
})

describe('createDownloadTaskEpic', () => {
  it('will create download task by comic info id', async () => {

    const comicInfoFactory = new ComicInfoFactory()
    const comicInfo = comicInfoFactory.createFromJson({
      id: 'id',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
      source: 'source',
      pageUrl: 'pageUrl',
      catalog: 'catalog',
      author: 'author',
      lastUpdatedChapter: 'lastUpdatedChapter',
      lastUpdatedTime: '2019-01-16T00:00:00.000Z',
      summary: 'summary',
      chapters: [],
    })

    const comicInfoInfoRepository: IComicInfoRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGetById: jest.fn(() => Promise.resolve(comicInfo)),
      asyncGetAllBySearchTerm: jest.fn(),
    }

    const downloadTaskRepository: IDownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)

    const downloadTask = downloadTaskFactory.createFromJson({
      id: comicInfo.identity,
      comicInfoId: comicInfo.identity,
      name: comicInfo.name,
      coverDataUrl: comicInfo.coverDataUrl,
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
      actions.waitForCreatingDownloadTask(),
      actions.addNewDownloadTaskToState(downloadTask.serialize()),
    ])
  })
})

describe('startToDownloadComicWhenNewDownloadTaskCreatedEpic', () => {
  it('will download comic after a download created', async () => {
    const downloadTaskRepository: IDownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }

    const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)

    const downloadTask = downloadTaskFactory.createFromJson({
      id: 'id',
      comicInfoId: 'comicInfoId',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
    })
    downloadTaskRepository.getById = jest.fn(() => downloadTask)

    const downloadComicService: IDownloadComicService = {
      asyncDownload: jest.fn(() => Promise.resolve()),
    }

    const actions$ = of(actions.addNewDownloadTaskToState(downloadTask))
    const result = await startToDownloadComicWhenNewDownloadTaskCreatedEpic(actions$, {}, {
      downloader: {
        downloadTaskRepository,
        downloadComicService
      }
    }).pipe(
      toArray(),
    ).toPromise()

    expect(downloadComicService.asyncDownload).toBeCalledWith(downloadTask)

    expect(result).toEqual([
      actions.sendDownloadStatusChangedSignal(),
    ])
  })
})

describe('syncDownloadTasksToStateWhenDownloadStatusChanged', () => {
  it('will sync download tasks from database to state', async () => {
    const downloadTaskRepository: IDownloadTaskRepository = {
      saveOrUpdate: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    }
    const downloadTaskFactory = new DownloadTaskFactory(downloadTaskRepository)

    const downloadTasks = [
      downloadTaskFactory.createFromJson({
        id: 'id-1',
        comicInfoId: 'comicInfoId-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        comicInfoId: 'comicInfoId-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.sendDownloadStatusChangedSignal())
    const result = await syncDownloadTasksToStateWhenDownloadStatusChanged(actions$, {}, {downloader: {downloadTaskRepository}}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.syncDownloadTasksToState(downloadTasks.map(downloadTask => downloadTask.serialize())),
    ])
  })
})

describe('transformDownloadTaskUpdatedEventToSignalEpic', () => {
  it('will transform download task event to signal', async () => {
    const eventPublisher = {
      getEventStream: jest.fn(() => of(new DownloadTaskUpdatedEvent())),
    }

    const actions$ = of()
    const result = await transformDownloadTaskUpdatedEventToSignalEpic(actions$, {}, {eventPublisher}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.sendDownloadStatusChangedSignal(),
    ])
  })
})

describe('updateUserProfileEpic', () => {
  it('will update user profile from database', async () => {
    const userProfileData = {
      downloadFolderPath: 'downloadFolderPath',
    }

    const userProfileFactory = new UserProfileFactory()

    const userProfileRepository: IUserProfileRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGet: jest.fn(),
    }

    const actions$ = of(actions.updateUserProfile(userProfileData))
    const result = await updateUserProfileEpic(actions$, {}, {
      general: {
        userProfileFactory,
        userProfileRepository
      }
    }).pipe(
      toArray(),
    ).toPromise()

    expect(userProfileRepository.asyncSaveOrUpdate).toBeCalledWith(userProfileFactory.createFromJson(userProfileData))

    expect(result).toEqual([
      actions.waitForUpdatingUserProfile(),
      actions.syncUserProfileToState(userProfileData),
    ])
  })
})
