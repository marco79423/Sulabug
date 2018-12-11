export interface SFSourceSite {

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
