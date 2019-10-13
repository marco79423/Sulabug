export const CREATE_COMIC_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS comic
    (
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
    );
`

export const CREATE_COMIC_TABLE_INDEX_SQL = `
    CREATE UNIQUE INDEX IF NOT EXISTS source_comic on comic (name, author);
`


export const INSERT_OR_UPDATE_COMIC_SQL = `
    INSERT OR
    REPLACE
    INTO comic (name, cover_url, source, source_page_url, catalog, author, last_updated_chapter,
                last_updated_time, summary, blueprint)
    VALUES ($name, $coverUrl, $source, $sourcePageRrl, $catalog, $author, $lastUpdatedChapter, $lastUpdatedTime,
            $summary, $blueprint);
`

export const QUERY_COMICS_SQL = `
    SELECT comic.name,
           comic.cover_url,
           comic.source,
           comic.source_page_url      AS                              sourcePageUrl,
           comic.catalog,
           comic.author,
           comic.last_updated_chapter AS                              lastUpdatedChapter,
           comic.last_updated_time    AS                              lastUpdatedTime,
           comic.summary,
           comic.blueprint,
           CASE WHEN collection.name IS NULL THEN FALSE ELSE TRUE END marked
    FROM comic
             LEFT JOIN collection ON comic.name = collection.name AND comic.author = collection.author
    WHERE comic.name LIKE $name
      AND ($marked = FALSE OR marked = $marked);
`
