import * as dotenv from 'dotenv';
import {
    createServer,
    request,
    RequestListener
} from 'http';
import {
    Codes,
    Methods
} from './constants';
import {createNewUser, getAllUsers} from './controllers/users';
import utils from './utils/index';

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const HEADERS = {'Content-Type': 'application/json'};

const server = createServer(async (req, res) => {
    if (req.method === Methods.GET && req.url === '/api/users') {
        const result = await getAllUsers();

        if (result.success) {
            res.writeHead(Codes.SUCCESS, HEADERS)
                .end(result.message);
        } else {
            res.writeHead(Codes.INTERNAL_ERROR);
        }
    }

    if (req.method === Methods.POST && req.url === '/api/users') {
        return createNewUser(req, res);
    }
});

server.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} port`);
});