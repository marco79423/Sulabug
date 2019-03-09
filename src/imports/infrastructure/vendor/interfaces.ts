export interface IDBHandler {

  asyncCreate(databaseName: string, collections: any[]): Promise<void>

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter): Promise<any[]>

  asyncFindOne(collectionName: string, filter): Promise<any>
}

