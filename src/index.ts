import * as dotenv from 'dotenv';
import {server} from './server.js';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const mainServer = server();

mainServer.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} port`);
});