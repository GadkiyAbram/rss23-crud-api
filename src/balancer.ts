import http, {IncomingMessage, ServerResponse} from 'http';
import utils from './utils/index.js';

const {roundRobin} = utils;

let workerIndex = 0;

export const balancer = (workerUrls: string[]) => {
    const currentWorkerUrl: string = workerUrls[workerIndex];

    return http.createServer((request: IncomingMessage, response: ServerResponse) => {
       http.get(currentWorkerUrl + request.url, (workerResponse: IncomingMessage) => {
          let workerData = '';

          workerResponse.on('data', (chunk) => {
              workerData += chunk;
          });

          workerResponse.on('end', () => {
              response.end(workerData);
          });

          workerIndex = roundRobin(workerIndex, workerUrls);
       });
    });
}