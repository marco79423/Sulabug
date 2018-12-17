import ComicInfo from '../entities/ComicInfo'

export interface SFComicInfoQueryAdapter {
  asyncGetComicInfos (): Promise<ComicInfo[]>
}
