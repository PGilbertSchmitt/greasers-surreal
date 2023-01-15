# Greasers Only Dot Com

What is this, like my 3rd or 4th attempt to create GreasersOnly? It's seriously not that difficult to make a Cards Against Humanities clone. Like, it would be mostly trivial to do build a backend in Express.

Anyways, I found out about [SurrealDB](https://surrealdb.com/) and decided to try and build the backend entirely using this freakishly powerful database. Here goes nothing.

## Quick Start

```
$ git clone THIS-REPO
$ pnpm i
$ pnpm run build-seeds
$ pnpm run server-watch
```

## Development

This repo is managed by `pnpm`, so be sure to install it to correctly install dependencies.

Afterwards, it is necessary to build seed files for the cards. The following command will convert the CSV files in `card_data/` and compile them into SurQL files which can be imported into a SurQL instance:

```sh
$ pnpm run build-seeds
```

In order to run the service, you of course need to install [SurrealDB](https://surrealdb.com/docs/start/installation) locally. I will (hopefully) migrate to relying on a Docker container eventually, but this is good enough for now while I make sure I actually like developing with SurrealDB (so far so good).

Once you have the `surreal` executable in your path, you can run the following to start the server watcher:
```
$ pnpm run server-watch
```
This will start the SurrealDB instance in memory and keep an eye on any `.surql` files in `queries/`. If any file updates, the SurrealDB instance will be dropped, restarted, and reinstantiated.