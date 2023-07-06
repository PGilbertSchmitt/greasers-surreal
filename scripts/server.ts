import fs from 'fs/promises';
import { watch } from 'chokidar';
import * as R from 'ramda';
import { ChildProcessWithoutNullStreams, exec, ExecException, spawn } from 'child_process';
import { argv } from 'process';

const QUERY_FOLDER = './queries';
const PLAYGROUND_FOLDER = './playground';

const SURREAL = 'surreal';
const SERVER_ARGS = ['start', '--log', 'debug', '--user', 'root', '--pass', 'root', 'memory'];
const IMPORT_STR = 'surreal import --conn http://localhost:8000 --user root --pass root --ns test --db test';

const main = async () => {
    const folder = argv.includes('-p') ? PLAYGROUND_FOLDER : QUERY_FOLDER;
    const files = await fs.readdir(folder);

    // The seed files start with `_` so that they can be differentiated from the
    // non-seed files. The non-seeds define the tables, so they need to be run first.
    const [
        seedFiles,
        tableFiles,
    ] = R.partition(file => file[0] === '_', files).map(R.map(file => `${folder}/${file}`));
    
    let serverProcess: ChildProcessWithoutNullStreams;
    
    const bootup = async () => {
        serverProcess = startServer();
        await runQueries(tableFiles);
        await runQueries(seedFiles);
    }
    
    bootup();

    // Doesn't work right now for some reason
    // // This could be better by switching to 'all' and debouncing the callback
    // watch(files).on('change', async (path: string) => {
    //     console.log(`${path} updated, killing and restarting server...`);
    //     serverProcess.kill();
    //     bootup();
    // });
};

const startServer = () => {
    const serverProc = spawn(SURREAL, SERVER_ARGS);
    // The actual server logs are output to stderr. As far as I can tell, the only thing SurrealDB pipes into stdout is the banner message
    serverProc.stderr.pipe(process.stdout);
    return serverProc;
};

const runQueries = async (files: string[]) => {
    console.log(`Running queries for:\n${files.map(R.concat('- ')).join('\n')}`)
    await Promise.all(files.map(file =>
        new Promise<void>(res => {
            exec(`${IMPORT_STR} ${file}`, () => res());
        })
    ));
};

main().catch(console.error);
