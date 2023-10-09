# Schema

## User
|Col|Type|
|-|-|
|`username`|string|

Only has a username, no password. The `signup` action with a username creates a new user and authenticates a user client by returning a JWT (under scope `players`). The user will last as long as the game, then disappear. This makes the user resource temporary. The username doesn't have a unique index on it, so two users can currently have the same name at the same time. It's fine because the username isn't actually used for the session, only the JWT.

## Lobby
|Col|Type|Info|
|-|-|-|
|`name`|string|Between 3 and 32 characters, must be unique (against current existing games)|
|`owner`|User|The creator of the lobby|
|`pass`|string|Lobby password, between 6 and 32 characters|
|`maxPlayers`|int|Between 3 and 12|
|`scoreThreshold|int|Between 3 and 20|

Before a game can start, everyone who will partake in the game must be able to join the lobby. The lobby has full `SELECT` and `CREATE` permissions, though the `CREATE` should be changed so that there can't be 2 lobbies with the same owner.

Joining a lobby can't happen directly. The `UPDATE` permissions on the table are set to `NONE`. Instead, there are 2 special tables, `join_lobby` and `in_lobby`.

### In Lobby
|Col|Type|
|-|-|
|`in`|User|
|`out`|Lobby|

This table is only used for relations, via `RELATE $user->in_lobby->$lobby`. All non-owner players joining a lobby will have this relation. It is not called by the client, but instead within an event on the `join_lobby` table.

### Join Lobby
|Col|Type|
|-|-|
|`playerId`|User|
|`lobbyId`|Lobby|

When a user wants to join a lobby, they create a `join_lobby` record. This has a `join` event on it which will create the `in_lobby` relation between that user and the lobby. This is where the password checking happens.

