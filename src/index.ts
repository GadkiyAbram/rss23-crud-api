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
import {StringAsJSON} from "./utils/StringAsJSON";

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
        let newUserData: string = '';

        req.on('data', (chunk) => {
            newUserData += chunk;
        });

        req.on('end', async () => {
            const newUser = await createNewUser(newUserData);
            
            if ('id' in newUser) {
                res.writeHead(Codes.SUCCESS_ADD)
                    .end();
            } else {
                res.writeHead(Codes.INTERNAL_ERROR);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} port`);
});