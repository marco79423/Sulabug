export const CREATE_COLLECTION_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS collection
    (
        name   VARCHAR NOT NULL,
        author VARCHAR
    );
`

export const CREATE_COLLECTION_TABLE_INDEX_SQL = `
    CREATE UNIQUE INDEX IF NOT EXISTS collection_index on collection (name, author);
`


export const ADD_COLLECTION_SQL = `
    INSERT OR
    REPLACE
    INTO collection (name, author)
    VALUES ($name, $author);
`

export const REMOVE_COLLECTION_SQL = `
    DELETE
    FROM collection
    WHERE name = $name
      AND author = $author;
`

export const QUERY_COLLECTION_SQL = `
    SELECT *
    FROM comic
    WHERE name = $name
      AND author = $author;
`
