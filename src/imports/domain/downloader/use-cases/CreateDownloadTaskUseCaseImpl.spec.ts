import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import CreateDownloadTaskUseCaseImpl from './CreateDownloadTaskUseCaseImpl'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../library/interfaces/use-cases'

describe('CreateDownloadTaskUseCaseImpl', () => {
  describe('asyncExecute', () => {
    it('will create a download task', async () => {
      const comicInfo = {
        id: 'id',
        name: 'name',
        coverDataUrl: 'coverDataUrl',
        source: 'source',
        pageUrl: 'pageUrl',
        catalog: 'catalog',
        author: 'author',
        lastUpdated: 'lastUpdated',
        summary: 'summary',
      }

      const queryComicInfoByIdentityFromDatabaseUseCase: QueryComicInfoByIdentityFromDatabaseUseCase = {
        asyncExecute: jest.fn(() => new Response(comicInfo)),
      }

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const uc = new CreateDownloadTaskUseCaseImpl(queryComicInfoByIdentityFromDatabaseUseCase, downloadTaskFactory, downloadTaskRepository)
      const res = await uc.asyncExecute(new Request(comicInfo.id))

      expect(queryComicInfoByIdentityFromDatabaseUseCase.asyncExecute).toBeCalledWith(new Request(comicInfo.id))

      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTaskFactory.createFromJson({
        id: comicInfo.id,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      }))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
