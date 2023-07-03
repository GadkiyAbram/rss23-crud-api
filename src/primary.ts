import * as dotenv from 'dotenv';
import cluster from 'cluster';
import os from 'os';
import {balancer} from './servers/balancer.ts';
import {Server} from "./servers/server.ts";

dotenv.config();

const cpuCount = os.cpus().length;
const HOST: string = process.env.HOST as string;
const PORT: number = parseInt(process.env.PORT as string, 10) || 7000;

const workerUrls: string[] = [];

if (cluster.isPrimary) {
    let workerPort = PORT;

    for (let i = 0; i < cpuCount; i++) {

        cluster.fork({workerPort: ++workerPort});
        workerUrls.push(`${HOST}:${workerPort}`);
    }

    const balancerServer = balancer(workerUrls);

    balancerServer.listen(PORT, () => {
        console.log(`Main Cluster running on ${PORT}`);
    });

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker on ${process.pid} died`);
        cluster.fork();
    });
} else {
    let workerPort = process.env.workerPort;

    new Server().createServer().listen(workerPort, () => console.log(`Worker is running on port ${workerPort}`));
}