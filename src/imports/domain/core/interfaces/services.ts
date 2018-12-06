import ComicInfo from '../entities/ComicInfo'

export interface SFComicInfoQueryService {
  asyncQuery(): Promise<ComicInfo[]>
}
