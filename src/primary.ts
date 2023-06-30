import * as dotenv from 'dotenv';
import cluster from 'cluster';
import os from 'os';
import {server} from './server.js';
import http from 'http';
import {balancer} from './balancer.js';

dotenv.config();

const cpuCount = os.cpus().length;
const HOST: string = process.env.HOST as string;
let port: number = parseInt(process.env.PORT as string, 10) || 7000;

let workerIndex: number = 0;

const workerUrls: string[] = [];

if (cluster.isPrimary) {
    console.log(`Master process ${process.pid} on ${port} is running`);

    for (let i = 0; i < cpuCount; i++) {
        let workerPort = ++port;

        cluster.fork({port: workerPort});
        workerUrls.push(`${HOST}:${workerPort}`);
    }

    const primaryServer = balancer(workerUrls);

    // const primaryServer = http.createServer((req, resp) => {
    //     const currentWorkerUrl: string = workerUrls[workerIndex];
    //
    //     http.get(currentWorkerUrl + req.url, (response) => {
    //         let data = '';
    //
    //         response.on('data', (chunk) => {
    //             data += chunk;
    //         });
    //
    //         response.on('end', () => {
    //             resp.end(data);
    //             workerIndex = (workerIndex + 1) % workerUrls.length
    //         });
    //     });
    // });

    primaryServer.listen(4000, () => {
        console.log(`Main Cluster running on 4000`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker on ${process.pid} died`);
        cluster.fork();
    });
} else {
    let workerPort = process.env.port;

    const workerServer = server();

    // process.on('message', function(msg) {
    //     console.log('Worker ' + process.pid + ' received message from master.', msg);
    // });

    // cluster.on('message', () => {
    //     console.log(`Response from ${workerPort}`);
    // });

    workerServer.listen(workerPort, () => console.log(`Worker is running on port ${workerPort}`));
}