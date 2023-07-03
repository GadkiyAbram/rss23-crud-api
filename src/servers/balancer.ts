import http, {IncomingMessage, ServerResponse} from 'http';
import utils from '../utils/index.ts';

const {roundRobin} = utils;

let workerIndex = 0;

export const balancer = async (workerUrls: string[]) => {
    const currentWorkerUrl: string = workerUrls[workerIndex];

    return http.createServer((request: IncomingMessage, response: ServerResponse) => {
       new Promise((resolve, reject) => {
           http.get(currentWorkerUrl + request.url, (workerResponse: IncomingMessage) => {
               let workerData = '';

               workerResponse.on('data', (chunk) => {
                   workerData += chunk;
               });

               workerResponse.on('end', () => {
                   response.end(workerData);

                   resolve(workerData);
               });

               workerIndex = roundRobin(workerIndex, workerUrls);
           });

       });
    });
}