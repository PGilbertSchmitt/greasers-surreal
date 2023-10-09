DEFINE TABLE foo SCHEMALESS
    PERMISSIONS
        FOR CREATE, SELECT FULL
        FOR UPDATE, DELETE NONE;

DEFINE TABLE join_foo SCHEMAFULL PERMISSIONS FOR CREATE FULL;
DEFINE EVENT join_foo ON TABLE join_foo WHEN $event = 'CREATE' THEN {
    LET $join_foo_id = $value.id;
    CREATE foo SET boo = 'boo_hoo';
    DELETE $join_foo_id;
};
