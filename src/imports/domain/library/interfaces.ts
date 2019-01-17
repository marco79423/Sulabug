import ComicInfo from './entities/ComicInfo'

export interface SFComicInfoQueryAdapter {
  asyncGetComicInfos(): Promise<ComicInfo[]>
}

export interface ComicInfoFactory {
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

export interface ComicInfoRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}
