ALTER TABLE songs ADD COLUMN lyrics TEXT NOT NULL DEFAULT '';
ALTER TABLE songs ALTER COLUMN lyrics DROP DEFAULT;

-- Recreate songs_search materialized view and functions,
-- copied/adapted from 20260907235412_search

DROP FUNCTION search_songs(q text);
DROP MATERIALIZED VIEW songs_search;

CREATE MATERIALIZED VIEW songs_search AS
SELECT
    songs.*,
    SETWEIGHT(TO_TSVECTOR('english', songs.title), 'A')
        || SETWEIGHT(TO_TSVECTOR('english', artists.name), 'B')
--      || SETWEIGHT(TO_TSVECTOR('english', songs.sheet), 'C') -- OLD
        || SETWEIGHT(TO_TSVECTOR('english', songs.lyrics), 'C') -- NEW
        || SETWEIGHT(TO_TSVECTOR('english', COALESCE(songs.keywords, '')), 'D')
        AS search_vector
FROM songs
INNER JOIN artists ON artists.id = songs.artist;
GRANT SELECT ON songs_search TO public;

CREATE INDEX songs_search_index ON songs_search USING gin(search_vector);
CREATE UNIQUE INDEX songs_search_id_index ON songs_search (id);

CREATE FUNCTION search_songs(q text)
RETURNS SETOF songs_search
LANGUAGE SQL
STABLE
AS $$
    SELECT *
    FROM songs_search
    WHERE search_vector @@ websearch_to_tsquery('english', q)
    ORDER BY ts_rank(search_vector, websearch_to_tsquery('english', q)) DESC
$$;
