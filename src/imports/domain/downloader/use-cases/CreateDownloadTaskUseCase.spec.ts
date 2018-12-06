import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import CreateDownloadTaskUseCase from './CreateDownloadTaskUseCase'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {QueryComicInfoByIdentityFromDatabaseUseCase} from '../../core/interfaces/use-cases'

describe('CreateDownloadTaskUseCase', () => {
  describe('asyncExecute', () => {
    it('will create a download task', async () => {
      const comicInfo = {
        id: 'id',
        name: 'name',
        coverImage: {
          id: 'id',
          comicInfoId: 'comicInfoId',
          mediaType: 'mediaType',
          base64Content: 'base64Content',
        },
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
      const uc = new CreateDownloadTaskUseCase(queryComicInfoByIdentityFromDatabaseUseCase, downloadTaskFactory, downloadTaskRepository)
      const res = await uc.asyncExecute(new Request(comicInfo.id))

      expect(queryComicInfoByIdentityFromDatabaseUseCase.asyncExecute).toBeCalledWith(new Request(comicInfo.id))

      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTaskFactory.createFromJson({
        id: comicInfo.id,
        name: comicInfo.name,
        coverImage: comicInfo.coverImage,
        sourceUrl: comicInfo.pageUrl,
      }))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
