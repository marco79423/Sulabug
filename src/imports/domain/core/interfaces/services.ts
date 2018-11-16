import ComicInfo from '../entities/ComicInfo'
import DownloadTask from '../entities/DownloadTask'

export interface SFComicInfoQueryService {
  asyncQuery(): Promise<ComicInfo[]>
}


export interface SFDownloadComicService {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}
