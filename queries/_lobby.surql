DEFINE TABLE lobby SCHEMAFULL
    PERMISSIONS
        FOR SELECT, CREATE FULL
        FOR UPDATE, DELETE NONE;

DEFINE FIELD name ON TABLE lobby
    TYPE string
    ASSERT string::length($value) >= 3
       AND string::length($value) <= 30;
DEFINE INDEX name_idx ON TABLE lobby COLUMNS name UNIQUE;

DEFINE FIELD owner ON TABLE lobby VALUE $before OR $auth;

DEFINE FIELD pass ON TABLE lobby
    TYPE string
    ASSERT string::length($value) >= 6
       AND string::length($value) <= 30
    PERMISSIONS FOR SELECT WHERE owner == $auth;

DEFINE FIELD max_players ON TABLE lobby
    TYPE int
    ASSERT $value >= 3
       AND $value <= 12;

DEFINE FIELD score_threshold ON TABLE lobby
    TYPE int
    ASSERT $value >= 3
       AND $value <= 20;
