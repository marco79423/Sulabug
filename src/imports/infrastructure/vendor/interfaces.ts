export interface IDBHandler {

  asyncCreate(databaseName: string, collections: any[]): Promise<void>

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter): Promise<any[]>

  asyncFindOne(collectionName: string, filter): Promise<any>
}

export interface IFileHandler {

  asyncEnsureDir(targetDirPath: string): Promise<void>

  asyncReadJson(targetPath: string, defaultJson: any): Promise<any>

  asyncWriteJson(targetPath: string, data: any): Promise<void>

  asyncPathExists(targetPath: string): Promise<boolean>
}
