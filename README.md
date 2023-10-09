# Greasers Only Dot Com

What is this, like my 3rd or 4th attempt to create GreasersOnly? It's seriously not that difficult to make a Cards Against Humanities clone. Like, it would be mostly trivial to do build a backend in Express.

Anyways, I found out about [SurrealDB](https://surrealdb.com/) and decided to try and build the backend entirely using this freakishly powerful database. Here goes nothing.

## Quick Start

```
$ git clone THIS-REPO
$ pnpm i
$ pnpm seed
$ docker compose up
$ pnpm reloader
```

## Development

This repo is managed by `pnpm`, so be sure to install it to correctly install dependencies.

Afterwards, it is necessary to build seed files for the cards (technically you can avoid it, but then your decks will be empty). The following command will convert the CSV files in `card_data/` and compile them into SurQL files which can be imported into a SurQL instance:

```sh
$ pnpm run build-seeds
```

The service is managed via docker compose. `docker compose up` will start the surrealdb instance which will run only in memory, so there is no data persistence for now.

For some reason, the `import`/`export` surreal commands don't work in the docker-hosted instance, due to this error: 
```
2023-10-09T13:15:29.727357Z ERROR surreal::cli: There was a problem with the database: The protocol or storage engine does not support backups on this architecture
```
I recently (10/7/23) asked in the discord about this but didn't get any valuable info. So I've created a script to automatically restart the container and perform HTTP POST calls to the `/import` endpoint using the `.surql` files in the `./db_init` dir. The script watches changes to the files in `./db_init`, so any changes will trigger another restart/import. This allows me to rapidly test changes to the schemas. To run the script, first be sure to have the container running, then call:
```
pnpm reloader
```
