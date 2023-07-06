DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT, UPDATE WHERE id = $user.id
        FOR DELETE NONE;
DEFINE FIELD username ON TABLE user TYPE string
    ASSERT string::len($value) >= 3
       AND string::len($value) <= 32;
-- DEFINE FIELD lobby ON TABLE user
--     PERMISSIONS
--         FOR CREATE NONE;

DEFINE SCOPE players
    SESSION 5h
    SIGNUP (CREATE user SET username=$username);
