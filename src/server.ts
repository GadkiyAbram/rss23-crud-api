import {createServer} from 'http';
import {
    codes,
    errors,
    methods
} from './constants/index.js';
import {
    createNewUser,
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser
} from './controllers/users.js';
import {objectAsString} from './utils/objectAsString.js';

const HEADERS = {'Content-Type': 'application/json'};

export const server = () => {
    return createServer(async (req, res) => {
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
                    res.writeHead(codes.SUCCESS_ADD).end(objectAsString(newUser));
                } else {
                    res.writeHead(codes.INTERNAL_ERROR).end();
                }
            });
        }

        if (req.method === methods.GET && req.url?.match(/users\//)) {
            const userId: string = req.url.split('/')[3];

            if (!userId.match(/\w+/)) {
                res.writeHead(codes.BAD_DATA).end(errors.INVALID_USER_ID);
            }

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
                        .end(objectAsString(result));
                } else {
                    res.writeHead(codes.INTERNAL_ERROR).end();
                }
            });
        }

        if (req.method === methods.DELETE && req.url?.match(/users\//)) {
            const userId: string = req.url?.split('/')[3];

            if (!userId.match(/\w+/)) {
                res.writeHead(codes.BAD_DATA).end(errors.INVALID_USER_ID);
            }

            const deleted = await deleteUser(userId);

            if (deleted) {
                res.writeHead(codes.DELETED).end();
            } else {
                res.writeHead(codes.NOT_FOUND).end(errors.USER_NOT_FOUND);
            }
        }
    });
}