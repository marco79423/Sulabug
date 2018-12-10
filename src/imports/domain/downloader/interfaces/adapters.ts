export interface NetAdapter {

  asyncGetText(targetUrl: string): Promise<string>

  asyncDownload(targetUrl: string, targetPath: string): Promise<void>
}
