import 'reflect-metadata'

import {of} from 'rxjs'

import {actions} from '../ducks/mainDuck'
import {
  createDownloadTaskEpic,
  initializeDataFromDBWhenAppStartsEpic,
  searchComicsEpic,
  sendSignalWhenComicDBIsEmptyEpic,
  startToDownloadComicWhenNewDownloadTaskCreatedEpic,
  syncDownloadTasksToStateWhenDownloadStatusChanged,
  transformDownloadTaskUpdatedEventToSignalEpic, updateComicDatabaseEpic,
  updateUserProfileEpic
} from './mainEpic'
import {toArray} from 'rxjs/operators'
import DownloadTaskUpdatedEvent from '../../domain/event/DownloadTaskUpdatedEvent'
import UserProfile from '../../domain/entities/UserProfile'
import UserProfileFactory from '../../domain/factories/UserProfileFactory'
import {
  IComicDatabaseService,
  IComicRepository,
  IDownloadComicService,
  IDownloadTaskRepository,
  IUserProfileRepository
} from '../../domain/interfaces'
import ComicFactory from '../../domain/factories/ComicFactory'
import DownloadTaskFactory from '../../domain/factories/DownloadTaskFactory'

describe('initializeDataFromDBWhenAppStartsEpic', () => {
  it('will query init data from database and then sync to state in the beginning', async () => {
    const userProfileRepository: IUserProfileRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGet: jest.fn(),
    }

    const userProfile = new UserProfile(
      new Date('2019-01-01T00:00:00Z'),
      'comicsFolder',
    )

    userProfileRepository.asyncGet = jest.fn(() => Promise.resolve(userProfile))

    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({
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
      comicFactory.createFromJson({
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

    const comicRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comics)),
    }

    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({comicIdentity: 'comicIdentity-1'}),
      comicFactory.createFromJson({comicIdentity: 'comicIdentity-2'}),
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
        comicId: 'comicId-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        comicId: 'comicId-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.sendAppStartSignal())
    const result = await initializeDataFromDBWhenAppStartsEpic(actions$, {}, {
      userProfileRepository,
      comicRepository: comicRepository,
      comicRepository,
      downloadTaskRepository,
    }).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.waitForQueryingInitDataFromDB(),
      actions.syncInitDataToState({
        userProfile: userProfile.serialize(),
        comics: comics.map(comic => comic.serialize()),
        comics: comics.map(comic => comic.serialize()),
        downloadTasks: downloadTasks.map(downloadTask => downloadTask.serialize()),
      }),
    ])
  })
})


describe('sendSignalWhenComicDBIsEmptyEpic', () => {
  it('will do nothing when db is not empty', async () => {
    const comicFactory = new ComicFactory()
    const comic = comicFactory.createFromJson({
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
      comics: [comic.serialize()],
      downloadTasks: []
    }))
    const result = await sendSignalWhenComicDBIsEmptyEpic(actions$).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([])
  })

  it('will send signal when db is empty', async () => {
    const actions$ = of(actions.syncInitDataToState({userProfile: {}, comics: [], downloadTasks: []}))
    const result = await sendSignalWhenComicDBIsEmptyEpic(actions$).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.sendComicDatabaseEmptySignal()
    ])
  })
})

describe('updateComicDatabaseEpic', () => {
  it('will update database from network and sync to state when db is empty', async () => {
    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({
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
      comicFactory.createFromJson({
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

    const comicDatabaseService: IComicDatabaseService = {
      asyncUpdateAndReturn: jest.fn(() => Promise.resolve(comics)),
    }

    const actions$ = of(actions.sendComicDatabaseEmptySignal())
    const result = await updateComicDatabaseEpic(actions$, {}, {comicDatabaseService: comicDatabaseService}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.waitForComicDatabaseUpdate(),
      actions.syncComicsToState(comics.map(comic => comic.serialize())),
      actions.sendComicDatabaseUpdatedSignal(),
    ])
  })

  it('will update database from network', async () => {
    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({
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
      comicFactory.createFromJson({
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

    const comicDatabaseService: IComicDatabaseService = {
      asyncUpdateAndReturn: jest.fn(() => Promise.resolve(comics)),
    }

    const actions$ = of(actions.updateComicDatabase())
    const result = await updateComicDatabaseEpic(actions$, {}, {comicDatabaseService: comicDatabaseService}).pipe(
      toArray(),
    ).toPromise()

    expect(result).toEqual([
      actions.waitForComicDatabaseUpdate(),
      actions.syncComicsToState(comics.map(comic => comic.serialize())),
      actions.sendComicDatabaseUpdatedSignal(),
    ])
  })
})

describe('searchComicsEpic', () => {
  it('will search comic infos by search term from database', async () => {
    const comicFactory = new ComicFactory()
    const comics = [
      comicFactory.createFromJson({
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
      comicFactory.createFromJson({
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

    const comicRepository = {
      asyncGetAllBySearchTerm: jest.fn(() => Promise.resolve(comics)),
    }

    const actions$ = of(actions.searchComic('search term'))
    const result = await searchComicsEpic(actions$, {}, {comicRepository: comicRepository}).pipe(
      toArray(),
    ).toPromise()

    expect(comicRepository.asyncGetAllBySearchTerm).toBeCalledWith('search term')

    expect(result).toEqual([
      actions.waitForResultOfSearchingComicsFromDB(),
      actions.syncComicsToState(comics.map(comic => comic.serialize())),
    ])
  })
})

describe('createDownloadTaskEpic', () => {
  it('will create download task by comic info id', async () => {

    const comicFactory = new ComicFactory()
    const comic = comicFactory.createFromJson({
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

    const comicRepository: IComicRepository = {
      asyncSaveOrUpdate: jest.fn(),
      asyncGetById: jest.fn(() => Promise.resolve(comic)),
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
      id: comic.identity,
      comicId: comic.identity,
      name: comic.name,
      coverDataUrl: comic.coverDataUrl,
    })

    const actions$ = of(actions.createDownloadTask(comic.identity))
    const result = await createDownloadTaskEpic(actions$, {}, {
      comicRepository: comicRepository,
      downloadTaskFactory,
      downloadTaskRepository,
    }).pipe(
      toArray(),
    ).toPromise()

    expect(comicRepository.asyncGetById).toBeCalledWith(comic.identity)
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
      comicId: 'comicId',
      name: 'name',
      coverDataUrl: 'coverDataUrl',
    })
    downloadTaskRepository.getById = jest.fn(() => downloadTask)

    const downloadComicService: IDownloadComicService = {
      asyncDownload: jest.fn(() => Promise.resolve()),
    }

    const actions$ = of(actions.addNewDownloadTaskToState(downloadTask))
    const result = await startToDownloadComicWhenNewDownloadTaskCreatedEpic(actions$, {}, {
      downloadTaskRepository,
      downloadComicService
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
        comicId: 'comicId-1',
        name: 'name-1',
        coverDataUrl: 'coverDataUrl-1',
      }),
      downloadTaskFactory.createFromJson({
        id: 'id-2',
        comicId: 'comicId-2',
        name: 'name-2',
        coverDataUrl: 'coverDataUrl-2',
      }),
    ]
    downloadTaskRepository.getAll = jest.fn(() => downloadTasks)

    const actions$ = of(actions.sendDownloadStatusChangedSignal())
    const result = await syncDownloadTasksToStateWhenDownloadStatusChanged(actions$, {}, {downloadTaskRepository}).pipe(
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
      databaseUpdatedTime: '2019-01-01T00:00:00.000Z',
      downloadFolderPath: 'downloadFolderPath',
    }

    const userProfileRepository: IUserProfileRepository = {
      asyncSaveOrUpdate: jest.fn(() => Promise.resolve()),
      asyncGet: jest.fn(),
    }

    const userProfileFactory = new UserProfileFactory()

    const actions$ = of(actions.updateUserProfile(userProfileData))
    const result = await updateUserProfileEpic(actions$, {}, {userProfileFactory, userProfileRepository}).pipe(
      toArray(),
    ).toPromise()

    expect(userProfileRepository.asyncSaveOrUpdate).toBeCalledWith(userProfileFactory.createFromJson(userProfileData))

    expect(result).toEqual([
      actions.waitForUpdatingUserProfile(),
      actions.syncUserProfileToState(userProfileData),
    ])
  })
})
