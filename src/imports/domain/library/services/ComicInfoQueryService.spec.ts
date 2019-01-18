import 'reflect-metadata'
import {ISFComicInfoQueryAdapter} from '../interfaces'
import ComicInfoQueryService from './ComicInfoQueryService'


describe('ComicInfoQueryService', () => {
  it('will handle download task to download comic', async () => {
    const sfComicInfoQueryAdapter: ISFComicInfoQueryAdapter = {
      asyncGetComicInfos: jest.fn(),
    }

    const comicInfoQueryService = new ComicInfoQueryService(sfComicInfoQueryAdapter)

    await comicInfoQueryService.asyncQueryComicInfos()
    expect(sfComicInfoQueryAdapter.asyncGetComicInfos).toBeCalled()
  })
})
