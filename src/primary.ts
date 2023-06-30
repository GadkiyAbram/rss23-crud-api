import cluster from 'cluster';
import http from 'http';
import os from 'os';
let port = 5000;
const server = http.createServer().listen(port);

if (cluster.isPrimary) {
    for (let i = 0; i < os.cpus().length - 1; i++) {
        server.on("connect", (req) => {
            const worker = cluster.fork();
            worker.send(req);
        });
    }
}

if (cluster.isWorker) {
    const worker_CRUD_server = http
        .createServer(/* hadling requests and sending responses - CRUD with postsDB*/)
        .listen(++port, () => {
            console.log(`Server is up and running on ${port} port`);
        });

    process.on("message", (req) => {
        /* somehow send req to worker_CRUD_server and invoke proceeding request and sending response to client?? */
    });
}