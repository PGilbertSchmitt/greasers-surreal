import fs from 'fs/promises';
import { watch } from 'chokidar';
import { exec, spawn } from 'child_process';

const SURREAL = 'surreal';
const SERVER_ARGS = ['start', '--log', 'debug', '--user', 'root', '--pass', 'root', 'memory'];
const IMPORT_STR = 'surreal import --conn http://localhost:8000 --user root --pass root --ns test --db test';

const main = async () => {
    const files = (
        await fs.readdir('./queries')
    ).map(file => `./queries/${file}`);
    
    let serverProcess;
    
    const bootup = async () => {
        serverProcess = startServer();
        await runQueries(files);
    }
    
    bootup();
    // This could be better by switching to 'all' and debouncing the callback
    watch(files).on('change', async (path: string) => {
        console.log(`${path} updated, killing and restarting server...`);
        serverProcess.kill();
        bootup();
    });
};

const startServer = () => {
    const serverProc = spawn(SURREAL, SERVER_ARGS);
    // The actual server logs are output to stderr. As far as I can tell, the only thing SurrealDB pipes into stdout is the banner message
    serverProc.stderr.on('data', info => console.log(info.toString()));
    return serverProc;
};

const runQueries = async (files: string[]) => {
    files.map(file => new Promise((res, rej) => {
        exec(`${IMPORT_STR} ${file}`, (err, output) => {
            console.log(output);
            return err ? rej(err) : res(output);
        });
    }));
};

main().catch(console.error);