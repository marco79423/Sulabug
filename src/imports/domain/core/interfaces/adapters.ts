export interface FileAdapter {

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>
}


export interface NetAdapter {

  asyncGetText(targetUrl: string): Promise<string>

  asyncGetBinaryBase64(targetUrl: string): Promise<string>
}
