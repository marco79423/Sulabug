import ComicInfo from '../entities/ComicInfo'

export interface ComicInfoStorageRepository {

  asyncSaveOrUpdate(comicInfo: ComicInfo): Promise<void>

  asyncGetById(identity: string): Promise<ComicInfo | null>

  asyncGetAllBySearchTerm(searchTerm: string): Promise<ComicInfo[]>
}
