export default interface IDatabase {

  asyncSaveOrUpdate(collectionName: string, item): Promise<void>

  asyncFind(collectionName: string, filter?): Promise<any>

  asyncFindOne(collectionName: string, filter?): Promise<any>
}

export interface ISFSourceSite {

  asyncGetComicInfos(): Promise<{
    name: string,
    coverDataUrl: string,
    pageUrl: string,
    catalog: string,
    author: string,
    lastUpdated: string,
    summary: string,
  }[]>

  asyncGetAllChaptersByComicPageUrl(pageUrl: string): Promise<{
    name: string,
    pageUrl: string,
  }[]>

  asyncGetAllImagesFromChapterPageUrl(pageUrl: string): Promise<{
    name: string,
    imageUrl: string,
  }[]>
}
