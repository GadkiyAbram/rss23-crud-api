import * as dotenv from 'dotenv';
import {createServer, ServerResponse} from 'http';
import {
    codes,
    methods,
    errors
} from './constants';
import {
    createNewUser,
    getAllUsers,
    getUserById,
    updateUser
} from './controllers/users';
import {ObjectAsString} from './utils/ObjectAsString';
import {isUUID} from './utils/isUUID';
import * as url from "url";
import {validate} from "uuid";

dotenv.config();

if (!process.env.PORT) {
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 3000;

const HEADERS = {'Content-Type': 'application/json'};

const server = createServer(async (req, res) => {
    // res.writeHead(codes.SUCCESS).end(req.url);

    if (req.method === methods.GET && req.url === '/api/users') {
        const result = await getAllUsers();

        if (result.success) {
            res.writeHead(codes.SUCCESS, HEADERS).end(result.message);

        } else {
            res.writeHead(codes.INTERNAL_ERROR);
        }
    }

    if (req.method === methods.POST && req.url === '/api/users') {
        let newUserData: string = '';

        req.on('data', (chunk) => {
            newUserData += chunk;
        });

        req.on('end', async () => {
            const newUser = await createNewUser(newUserData);
            
            if ('id' in newUser) {
                res.writeHead(codes.SUCCESS_ADD)
                    .end();
            } else {
                res.writeHead(codes.INTERNAL_ERROR);
            }
        });
    }

    if (req.method === methods.GET && req.url?.match(/users\//)) {
        const userId: string = req.url.split('/')[3];

        if (!userId.match(/\w+/)) {
            res.writeHead(codes.BAD_DATA).end(errors.INVALID_USER_ID);
        }

        // if (!isUUID(userId)) {
        //     console.log(userId, isUUID(userId));
        //     res.writeHead(codes.BAD_DATA).end(errors.INVALID_USER_ID);
        // }

        // if (validate(userId)) {
        //     res.writeHead(codes.BAD_DATA).end(errors.INVALID_USER_ID);
        // }

        const result = await getUserById(userId);

        if (result.success) {
            res.writeHead(codes.SUCCESS, HEADERS)
                .end(result.message);
        } else {
            res.writeHead(codes.INTERNAL_ERROR).end(errors.USER_NOT_FOUND);
        }
    }

    if (req.method === methods.PUT && req.url?.match(/users\/\w+/)) {
        const userId: string = req.url.split('/')[3];

        let updatedUserData: string = '';

        req.on('data', (chunk) => {
            updatedUserData += chunk;
        });

        req.on('end', async () => {
            const result = await updateUser(userId, updatedUserData);

            if (
                result !== null &&
                result !== undefined &&
                'id' in result
            ) {
                res.writeHead(codes.SUCCESS)
                    .end(ObjectAsString(result));
            } else {
                res.writeHead(codes.INTERNAL_ERROR);
            }
        });
    }
});

server.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT} port`);
});