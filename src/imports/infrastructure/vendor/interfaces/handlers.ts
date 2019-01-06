export interface FileHandler {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>
}

export interface NetHandler {

  asyncGetText(targetUrl: string): Promise<string>

  asyncDownload(targetUrl: string, targetPath: string): Promise<void>

  asyncGetBinaryBase64(targetUrl: string): Promise<string>
}
