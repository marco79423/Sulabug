import 'reflect-metadata'
import {of} from 'rxjs'

import {Request, Response} from '../../base-types'
import CreateDownloadTaskUseCaseImpl from './CreateDownloadTaskUseCaseImpl'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../library/interfaces/use-cases'

describe('CreateDownloadTaskUseCaseImpl', () => {
  describe('execute', () => {
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
        execute: () => of(new Response(comicInfo)),
      }

      const downloadTaskRepository: DownloadTaskRepository = {
        saveOrUpdate: jest.fn(),
        getById: jest.fn(),
        getAll: jest.fn(),
        delete: jest.fn(),
      }

      const downloadTaskFactory = new DownloadTaskFactoryImpl(downloadTaskRepository)
      const uc = new CreateDownloadTaskUseCaseImpl(queryComicInfoByIdentityFromDatabaseUseCase, downloadTaskFactory, downloadTaskRepository)
      const res = await uc.execute(new Request(comicInfo.id)).toPromise()

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
