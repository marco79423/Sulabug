import ComicInfo from './entities/ComicInfo'

export interface ISFComicInfoQueryAdapter {
  asyncQueryComicInfos(): Promise<ComicInfo[]>
}

export interface IComicInfoFactory {
  createFromJson(json: {
    id: string,
    name: string,
    coverDataUrl: string,
    source: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdatedChapter: string,
    lastUpdatedTime: string,
    summary: string,
  }): ComicInfo
}

export interface IComicInfoRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}

export interface IComicInfoDatabaseService {

  asyncUpdateAndReturn(): Promise<ComicInfo[]>
}
