export const CREATE_COMIC_DATABASE_INFO_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS comic_database_info
    (
        source            VARCHAR NOT NULL PRIMARY KEY,
        last_updated_time DATE
    );
`
export const CREATE_COMIC_DATABASE_INFO_TABLE_INDEX_SQL = `
    CREATE UNIQUE INDEX IF NOT EXISTS comic_database_info_index on comic_database_info (source);
`
export const INSERT_OR_UPDATE_LAST_UPDATED_TIME_SQL = `
    INSERT OR
    REPLACE
    INTO comic_database_info (source, last_updated_time)
    VALUES ($source, $lastUpdatedTime);
`
export const QUERY_LAST_UPDATED_TIME_SQL = `
    SELECT last_updated_time AS lastUpdatedTime
    FROM comic_database_info
    WHERE source = $source
`
