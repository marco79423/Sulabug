import {
  IComic,
  IComicDAO,
  IComicDatabaseInfoDAO,
  IConfig,
  IDBAdapter,
  IFileAdapter,
  IHashAdapter,
  INetAdapter,
  IWebComicBlueprint,
  IWebComicSourceRepository
} from '../interface'
import {Comic} from './comic'


export class ComicDatabaseInfoDAO implements IComicDatabaseInfoDAO {
  private readonly _dbAdapter: IDBAdapter

  constructor(dbAdapter: IDBAdapter) {
    this._dbAdapter = dbAdapter
  }

  public async updateLastUpdatedTime(sourceCode: string, lastUpdatedTime: Date): Promise<void> {
    await this._createTableIfNotExists()
    await this._dbAdapter.run(`INSERT OR REPLACE INTO comic_database_info (source, last_updated_time) VALUES ($source, $lastUpdatedTime)`, {
      $source: sourceCode,
      $lastUpdatedTime: lastUpdatedTime,
    })
  }

  public async queryLastUpdatedTime(sourceCode: string): Promise<Date | null> {
    await this._createTableIfNotExists()
    const row = await this._dbAdapter.queryOne('SELECT last_updated_time as lastUpdatedTime from comic_database_info WHERE source=$source', {$source: sourceCode})
    if (row) {
      return row.lastUpdatedTime
    } else {
      return null
    }
  }

  private async _createTableIfNotExists() {
    await this._dbAdapter.run(`
      CREATE TABLE IF NOT EXISTS comic_database_info (
        source            VARCHAR NOT NULL PRIMARY KEY,
        last_updated_time DATE
    );`)
  }
}

export class ComicDAO implements IComicDAO {
  private readonly _config: IConfig
  private readonly _webComicSourceRepository: IWebComicSourceRepository
  private readonly _dbAdapter: IDBAdapter
  private readonly _hashAdapter: IHashAdapter
  private readonly _netAdapter: INetAdapter
  private readonly _fileAdapter: IFileAdapter

  constructor(config: IConfig, webComicSourceRepository: IWebComicSourceRepository, dbAdapter: IDBAdapter, hashAdapter: IHashAdapter, netAdapter: INetAdapter, fileAdapter: IFileAdapter) {
    this._config = config
    this._webComicSourceRepository = webComicSourceRepository
    this._dbAdapter = dbAdapter
    this._hashAdapter = hashAdapter
    this._netAdapter = netAdapter
    this._fileAdapter = fileAdapter
  }

  public async insertOrUpdate(comic: IComic): Promise<void> {
    await this._createTableIfNotExists()

    await this._dbAdapter.run(`
      INSERT OR REPLACE INTO comic (name, cover_url, source, source_page_url, catalog, author, last_updated_chapter, last_updated_time, summary, blueprint)
      VALUES ($name, $coverUrl, $source, $sourcePageRrl, $catalog, $author, $lastUpdatedChapter, $lastUpdatedTime, $summary, $blueprint)
    `, {
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

  public async queryOne(pattern: string): Promise<IComic | null> {
    await this._createTableIfNotExists()

    const row = await this._dbAdapter.queryOne(`SELECT name, cover_url, source, source_page_url AS sourcePageUrl, catalog, author, last_updated_chapter AS lastUpdatedChapter, last_updated_time AS lastUpdatedTime, summary, blueprint FROM comic WHERE name LIKE $name`, {$name: `%${pattern}%`})
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

  public async queryAll(pattern: string): Promise<IComic[]> {
    await this._createTableIfNotExists()

    const rows = await this._dbAdapter.queryAll(`SELECT name, cover_url, source, source_page_url AS sourcePageUrl, catalog, author, last_updated_chapter AS lastUpdatedChapter, last_updated_time AS lastUpdatedTime, summary, blueprint FROM comic WHERE name LIKE $name`, {$name: `%${pattern}%`})
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
    await this._dbAdapter.run(`
      CREATE TABLE IF NOT EXISTS comic (
        name                 VARCHAR NOT NULL,
        cover_url            VARCHAR NOT NULL,
        source               VARCHAR NOT NULL,
        source_page_url      VARCHAR NOT NULL,
        catalog              VARCHAR,
        author               VARCHAR,
        last_updated_chapter VARCHAR,
        last_updated_time    DATE,
        summary              TEXT,
        blueprint            TEXT    NOT NULL
    );`)

    await this._dbAdapter.run('CREATE UNIQUE INDEX IF NOT EXISTS source_comic on comic (name, author);')
  }

  private _createComic(name: string, source: string, sourcePageUrl: string, coverUrl: string, author: string, summary: string, catalog: string, lastUpdatedChapter: string, lastUpdatedTime: Date, blueprint: IWebComicBlueprint): IComic {
    return new Comic(
      this._config,
      this._webComicSourceRepository,
      this._hashAdapter,
      this._netAdapter,
      this._fileAdapter,
      this,
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
