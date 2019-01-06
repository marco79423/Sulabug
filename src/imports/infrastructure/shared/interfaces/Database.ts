export default interface Database {

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter?): Promise<any>

  asyncFindOne(collectionName: string, filter?): Promise<any>
}
