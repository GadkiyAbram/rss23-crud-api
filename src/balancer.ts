import cluster from 'cluster';
import * as cp from 'child_process';
import os from 'os';
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cpuCount = os.cpus().length;
let port = 5000;

cluster.setupPrimary({
    exec: __dirname + '/index.ts',
    args: [String(port)]
});

for (let i = 0; i < cpuCount; i++) {
    port = 8000 + i;
    // cluster.fork({
    //     execArgv: {port: port}
    // });

    const f = cp.fork(__dirname + '/index.ts', [], {execArgv: [String(port)]})

    // cp.fork(`${__dirname}/aaa.js`, [], { execArgv: ['--inspect-brk=9223']});
}

process.on('message', msg => {
    console.log(`Message from Master: ${msg}`);
});


cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} has been killed`);
    console.log('Starting another worker');
    cluster.fork();
});