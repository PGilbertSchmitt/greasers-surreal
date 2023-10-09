import fs from 'fs/promises';
import { watch } from 'chokidar';
import * as R from 'ramda';
import { exec } from 'child_process';
import { argv } from 'process';
import axios from 'axios';

const DB_INIT_FOLDER = './db_init';
const PLAYGROUND_FOLDER = './playground';

const SURREAL = 'surreal';
const SERVER_ARGS = ['start', '--log', 'trace', '--user', 'root', '--pass', 'root', 'memory'];

const main = async () => {
    const folder = argv.includes('-p') ? PLAYGROUND_FOLDER : DB_INIT_FOLDER;
    const files = await fs.readdir(folder);

    // The seed files start with `_` so that they can be differentiated from the
    // non-seed files. The non-seeds define the tables, so they need to be run first.
    const [
        seedFiles,
        tableFiles,
    ] = R.partition(file => file[0] === '_', files).map(R.map(file => `${folder}/${file}`));

    const bootup = async () => {
        await restartServer();
        console.log('Rebuilding schemas...');
        runImports(tableFiles);
        console.log('Re-seeding cards...');
        runImports(seedFiles);
        console.log('Done.');
    }
    
    bootup();

    // This could be better by switching to 'all' and debouncing the callback,
    // which would allow the script to recognized when files are created/deleted
    watch(tableFiles).on('change', async (path: string) => {
        console.log(`${path} updated, killing and restarting server...`);
        bootup();
    });
};

// Started web server on 0.0.0.0:8000
const restartServer = () => new Promise<void>((res, rej) => {
  exec('docker compose restart', err => {
    if (err) {
      rej(err);
    } else {
      // What would be cooler is if I tapped into the container's logs
      // and resolve when the server's "ready" log is read.
      setTimeout(() => {
        res();
      }, 1000);
    }
  });
});

const runImports = async (files: string[]) => {
  await Promise.allSettled(files.map(async file => {
    axios.post('http://localhost:8000/import', await fs.readFile(file), {
      headers: {
        NS: 'test',
        DB: 'test',
        Authorization: 'froot:froot',
        Accept: 'application/octet-stream',
      },
    });
  }));
};

main().catch(console.error);
