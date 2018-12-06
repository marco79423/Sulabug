import DownloadTask from '../entities/DownloadTask'

export interface SFDownloadComicService {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}
