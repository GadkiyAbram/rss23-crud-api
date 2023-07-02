import * as dotenv from 'dotenv';
import {serverOld} from './servers/serverOld.ts';
import {Server} from './servers/server.ts';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

export default new Server().createServer().listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} port`);
});

// const mainServer = server();
// mainServer