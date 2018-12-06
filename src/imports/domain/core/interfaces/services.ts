import ComicInfo from '../entities/ComicInfo'

export interface SFComicSiteService {
  asyncGetComicInfos(): Promise<ComicInfo[]>
}
