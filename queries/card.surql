-- pc and rc stand for `prompt card` and `response card` respectively. Since I'll be using
-- these IDs a lot, I'd like to keep the table name and the ID itself short.

DEFINE TABLE pc SCHEMAFULL
    PERMISSIONS
        FOR SELECT FULL
        FOR CREATE, UPDATE, DELETE NONE;

DEFINE FIELD prompt ON TABLE pc TYPE string;
DEFINE FIELD slots ON TABLE pc TYPE number;
DEFINE FIELD versions ON TABLE pc TYPE array;
DEFINE FIELD versions.* ON TABLE pc TYPE string;

DEFINE TABLE rc SCHEMAFULL
    PERMISSIONS
        FOR SELECT FULL
        FOR CREATE, UPDATE, DELETE NONE;

DEFINE FIELD response ON TABLE rc TYPE string;
DEFINE FIELD versions ON TABLE rc TYPE array;
DEFINE FIELD versions.* ON TABLE rc TYPE string;