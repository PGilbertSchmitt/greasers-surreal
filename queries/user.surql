DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT FULL
        FOR UPDATE WHERE id = $auth.id
        FOR CREATE, DELETE NONE;
DEFINE FIELD username ON TABLE user TYPE string
    ASSERT string::len($value) >= 3
       AND string::len($value) <= 32; 

DEFINE EVENT user_delete ON TABLE user WHEN $event='DELETE' THEN {
    DELETE authed WHERE userId = $value.id;
};

DEFINE SCOPE players
    SESSION 5h
    SIGNUP (CREATE user SET username=$username);

DEFINE TABLE authed
    AS SELECT id as userId FROM user
    PERMISSIONS
        FOR SELECT WHERE userId = $auth.id
        FOR CREATE, UPDATE, DELETE NONE;