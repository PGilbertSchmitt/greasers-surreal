DEFINE TABLE join_lobby SCHEMALESS
    PERMISSIONS
        FOR CREATE, SELECT WHERE $scope="players"
        FOR UPDATE, DELETE NONE;

DEFINE FIELD playerId ON TABLE join_lobby VALUE $before OR $auth;
DEFINE FIELD lobbyId ON TABLE join_lobby TYPE string;

DEFINE FUNCTION fn::str_to_thing($str: string) {
    LET $parts = string::split($str, ':');
    RETURN type::thing($parts[0], $parts[1]);
};

-- Only created via join_lobby CREATE event, not directly by users
DEFINE TABLE in_lobby SCHEMAFULL
    PERMISSIONS
        FOR UPDATE, CREATE NONE
        FOR DELETE, SELECT
            WHERE playerId=$auth.id;

DEFINE EVENT join ON TABLE join_lobby WHEN $event='CREATE' THEN {
    LET $tmp_id = $value.id;
    LET $player = $auth.id;
    LET $lobby = fn::str_to_thing($value.lobbyId);
    RELATE $player->in_lobby->$lobby;
    DELETE $tmp_id;
}

