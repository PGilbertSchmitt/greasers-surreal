DEFINE TABLE lobby SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE FULL
        FOR UPDATE, DELETE NONE;

DEFINE FIELD name ON TABLE lobby
    TYPE string
    ASSERT string::len($value) >= 3
       AND string::len($value) <= 32;
DEFINE INDEX name_idx ON TABLE lobby COLUMNS name UNIQUE;

DEFINE FIELD owner ON TABLE lobby VALUE $before OR $auth;

DEFINE FIELD pass ON TABLE lobby
    TYPE string
    ASSERT string::len($value) >= 6
       AND string::len($value) <= 32
    PERMISSIONS FOR SELECT WHERE owner == $auth;

DEFINE FIELD maxPlayers ON TABLE lobby
    TYPE int
    ASSERT $value >= 3
       AND $value <= 12;

DEFINE FIELD scoreThreshold ON TABLE lobby
    TYPE int
    ASSERT $value >= 3
       AND $value <= 20;
