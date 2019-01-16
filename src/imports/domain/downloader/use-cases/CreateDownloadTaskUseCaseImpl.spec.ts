import 'reflect-metadata'

import {Request, Response} from '../../base-types'
import CreateDownloadTaskUseCaseImpl from './CreateDownloadTaskUseCaseImpl'
import DownloadTaskFactoryImpl from '../factories/DownloadTaskFactoryImpl'
import {DownloadTaskRepository} from '../interfaces/repositories'
import {ComicInfoRepository} from '../../library/interfaces/repositories'
import ComicInfoFactoryImpl from '../../library/factories/ComicInfoFactoryImpl'

describe('CreateDownloadTaskUseCaseImpl', () => {
  describe('execute', () => {
    it('will create a download task', async () => {
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
      const uc = new CreateDownloadTaskUseCaseImpl(comicInfoInfoRepository, downloadTaskFactory, downloadTaskRepository)
      const res = await uc.execute(new Request(comicInfo.identity)).toPromise()

      expect(comicInfoInfoRepository.asyncGetById).toBeCalledWith(comicInfo.identity)

      expect(downloadTaskRepository.saveOrUpdate).toBeCalledWith(downloadTaskFactory.createFromJson({
        id: comicInfo.identity,
        name: comicInfo.name,
        coverDataUrl: comicInfo.coverDataUrl,
        sourceUrl: comicInfo.pageUrl,
      }))

      expect(res instanceof Response).toBeTruthy()
    })
  })
})
