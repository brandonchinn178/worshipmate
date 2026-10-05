ALTER TABLE songs ADD   COLUMN vocal_range TEXT[] NOT NULL DEFAULT ARRAY['', ''];
ALTER TABLE songs ALTER COLUMN vocal_range DROP DEFAULT;

ALTER TABLE songs
ADD CONSTRAINT vocal_range_items
CHECK (cardinality(vocal_range) = 2);
