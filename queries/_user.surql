DEFINE TABLE user SCHEMAFULL
    PERMISSIONS
        FOR SELECT, UPDATE WHERE id = $user.id
        FOR CREATE, DELETE NONE;
DEFINE FIELD username ON TABLE user TYPE string
    ASSERT string::length($value) >= 3
       AND string::length($value) <= 32;

DEFINE SCOPE players
    SESSION 5h
    SIGNUP (CREATE user SET username=$username);
