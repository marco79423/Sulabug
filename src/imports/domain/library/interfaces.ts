import ComicInfo from './entities/ComicInfo'

export interface ISFComicInfoQueryAdapter {
  asyncGetComicInfos(): Promise<ComicInfo[]>
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
    lastUpdated: string,
    summary: string,
  }): ComicInfo
}

export interface IComicInfoRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}
