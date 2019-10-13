import {
  ICollectionDAO,
  IComic,
  IComicDAO,
  IComicDatabaseInfoDAO,
  IComicFilter,
  IConfig,
  IDBAdapter,
  IFileAdapter,
  IHashAdapter,
  INetAdapter,
  IWebComicBlueprint,
  IWebComicSourceRepository
} from '../interface'
import {Comic} from './comic'
import * as sqls from './sqls'

export class ComicDatabaseInfoDAO implements IComicDatabaseInfoDAO {
  private readonly _dbAdapter: IDBAdapter

  constructor(dbAdapter: IDBAdapter) {
    this._dbAdapter = dbAdapter
  }

  public async updateLastUpdatedTime(sourceCode: string, lastUpdatedTime: Date): Promise<void> {
    await this._createTableIfNotExists()
    await this._dbAdapter.run(sqls.INSERT_OR_UPDATE_LAST_UPDATED_TIME_SQL, {
      $source: sourceCode,
      $lastUpdatedTime: lastUpdatedTime,
    })
  }

  public async queryLastUpdatedTime(sourceCode: string): Promise<Date | null> {
    await this._createTableIfNotExists()
    const row = await this._dbAdapter.queryOne(sqls.QUERY_LAST_UPDATED_TIME_SQL, {$source: sourceCode})
    if (row) {
      return row.lastUpdatedTime
    } else {
      return null
    }
  }

  private async _createTableIfNotExists() {
    await this._dbAdapter.run(sqls.CREATE_COMIC_DATABASE_INFO_TABLE_SQL)
    await this._dbAdapter.run(sqls.CREATE_COMIC_DATABASE_INFO_TABLE_INDEX_SQL)
  }
}


export class ComicDAO implements IComicDAO {
  private readonly _config: IConfig
  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _dbAdapter: IDBAdapter
  private readonly _hashAdapter: IHashAdapter
  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter
  private readonly _collectionDAO: ICollectionDAO

  constructor(config: IConfig, webComicSourceRepository: IWebComicSourceRepository, dbAdapter: IDBAdapter, hashAdapter: IHashAdapter, netAdapter: INetAdapter, fileAdapter: IFileAdapter, collectionDAO: ICollectionDAO) {
    this._config = config
    this._webComicSourceRepository = webComicSourceRepository
    this._dbAdapter = dbAdapter
    this._hashAdapter = hashAdapter
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
    this._collectionDAO = collectionDAO
  }

  public async insertOrUpdate(comic: IComic): Promise<void> {
    await this._createTableIfNotExists()

    await this._dbAdapter.run(sqls.INSERT_OR_UPDATE_COMIC_SQL, {
      $name: comic.name,
      $coverUrl: comic.coverUrl,
      $source: comic.source,
      $sourcePageRrl: comic.sourcePageUrl,
      $catalog: comic.catalog,
      $author: comic.author,
      $lastUpdatedChapter: comic.lastUpdatedChapter,
      $lastUpdatedTime: comic.lastUpdatedTime,
      $summary: comic.summary,
      $blueprint: JSON.stringify(comic.blueprint),
    })
  }

  public async insertOrUpdateMany(comics: IComic[]): Promise<void> {
    await this._createTableIfNotExists()

    await this._dbAdapter.runMany(sqls.INSERT_OR_UPDATE_COMIC_SQL, comics.map(comic => ({
      $name: comic.name,
      $coverUrl: comic.coverUrl,
      $source: comic.source,
      $sourcePageRrl: comic.sourcePageUrl,
      $catalog: comic.catalog,
      $author: comic.author,
      $lastUpdatedChapter: comic.lastUpdatedChapter,
      $lastUpdatedTime: comic.lastUpdatedTime,
      $summary: comic.summary,
      $blueprint: JSON.stringify(comic.blueprint),
    })))
  }

  public async queryOne(filter: IComicFilter): Promise<IComic | null> {
    await this._createTableIfNotExists()

    const row = await this._dbAdapter.queryOne(sqls.QUERY_COMICS_SQL, {
      $name: `%${filter.pattern}%`,
      $marked: filter.marked,
    })
    if (!row) {
      return null
    }

    const {name, source, sourcePageUrl, coverUrl, author, summary, catalog, lastUpdatedChapter, lastUpdatedTime, blueprint} = row
    return this._createComic(
      name,
      source,
      sourcePageUrl,
      coverUrl,
      author,
      summary,
      catalog,
      lastUpdatedChapter,
      lastUpdatedTime,
      JSON.parse(blueprint)
    )
  }

  public async queryAll(filter: IComicFilter): Promise<IComic[]> {
    await this._createTableIfNotExists()

    const rows = await this._dbAdapter.queryAll(sqls.QUERY_COMICS_SQL, {
      $name: `%${filter.pattern}%`,
      $marked: filter.marked,
    })
    return rows.map(({name, source, sourcePageUrl, coverUrl, author, summary, catalog, lastUpdatedChapter, lastUpdatedTime, blueprint}) => {
      return this._createComic(
        name,
        source,
        sourcePageUrl,
        coverUrl,
        author,
        summary,
        catalog,
        lastUpdatedChapter,
        lastUpdatedTime,
        JSON.parse(blueprint)
      )
    })
  }

  private async _createTableIfNotExists() {
    await this._dbAdapter.run(sqls.CREATE_COMIC_TABLE_SQL)
    await this._dbAdapter.run(sqls.CREATE_COMIC_TABLE_INDEX_SQL)
  }

  private _createComic(name: string, source: string, sourcePageUrl: string, coverUrl: string, author: string, summary: string, catalog: string, lastUpdatedChapter: string, lastUpdatedTime: Date, blueprint: IWebComicBlueprint): IComic {
    return new Comic(
      this._config,
      this._webComicSourceRepository,
      this._hashAdapter,
      this._netAdapter,
      this._fileAdapter,
      this,
      this._collectionDAO,
      name,
      source,
      sourcePageUrl,
      coverUrl,
      author,
      summary,
      catalog,
      lastUpdatedChapter,
      lastUpdatedTime,
      blueprint,
    )
  }
}

export class CollectionDAO implements ICollectionDAO {
  private readonly _dbAdapter: IDBAdapter

  constructor(dbAdapter: IDBAdapter) {
    this._dbAdapter = dbAdapter
  }

  public async add(comic: IComic): Promise<void> {
    await this._createTableIfNotExists()

    await this._dbAdapter.run(sqls.ADD_COLLECTION_SQL, {
      $name: comic.name,
      $author: comic.author,
    })
  }

  public async remove(comic: IComic): Promise<void> {
    await this._createTableIfNotExists()

    await this._dbAdapter.run(sqls.REMOVE_COLLECTION_SQL, {
      $name: comic.name,
      $author: comic.author,
    })
  }

  public async has(comic: IComic): Promise<boolean> {
    await this._createTableIfNotExists()
    const row = await this._dbAdapter.queryOne(sqls.QUERY_COLLECTION_SQL, {
      $name: comic.name,
      $author: comic.author,
    })
    return !!row
  }

  private async _createTableIfNotExists() {
    await this._dbAdapter.run(sqls.CREATE_COLLECTION_TABLE_SQL)
    await this._dbAdapter.run(sqls.CREATE_COLLECTION_TABLE_INDEX_SQL)
  }

}
