// GET api/users
import {
    IncomingMessage,
    ServerResponse
} from 'http';
import {User, Users} from '../interfaces/User';
import {create, findAll} from '../services/Users';
import {Codes} from '../constants';
import utils from '../utils/index';
import {StringAsJSON} from "../utils/StringAsJSON";

const {ObjectAsString} = utils;

type AllUsers = {
    success: boolean,
    message: string
}

export const getAllUsers = async (): Promise<AllUsers> => {
    try {
        const result: User[] = await findAll() || [];

        return {
            success: true,
            message: ObjectAsString(result)
        }
    } catch (err) {
        return {
            success: false,
            message: ''
        };
    }
}

// GET api/users/{userId}

// POST api/users
export const createNewUser = async (newUserData: string): Promise<User | {}> => {
    try {
        return await create(StringAsJSON(newUserData));
    } catch (_) {
        return {};
    }
}

// export const createNewUser = async (req: IncomingMessage, res: ServerResponse)=> {
//     try {
//         let newUserData: string = '';
//
//         req.on('data', (chunk) => {
//             newUserData += chunk;
//         });
//
//         req.on('end', async () => {
//             let newUser = JSON.parse(newUserData);
//
//             const addedUser: User = await create(newUser);
//
//             if (addedUser?.id) {
//                 res.writeHead(Codes.SUCCESS_ADD);
//                 res.end();
//             }
//         });
//         res.writeHead(Codes.SUCCESS_ADD, )
//     } catch (err) {
//         res.writeHead(Codes.INTERNAL_ERROR).end(err);
//     }
// }

// PUT api/users/{userId}

// DELETE api/users/{userId}