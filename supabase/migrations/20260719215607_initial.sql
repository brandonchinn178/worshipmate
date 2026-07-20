CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE
);
GRANT SELECT ON artists TO public;

CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    artist UUID NOT NULL REFERENCES artists (id),
    key TEXT NOT NULL
);
GRANT SELECT ON songs TO public;
