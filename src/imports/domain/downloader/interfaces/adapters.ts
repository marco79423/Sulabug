import DownloadTask from '../entities/DownloadTask'

export interface SFComicDownloadAdapter {
  asyncDownload(downloadTask: DownloadTask): Promise<void>
}
