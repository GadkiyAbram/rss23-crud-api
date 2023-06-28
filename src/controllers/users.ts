// GET api/users
import {User, Users} from '../interfaces/Users/User';
import {create, find, findAll, update} from '../services/Users/Users';
import utils from '../utils/index';
import {StringAsJSON} from '../utils/StringAsJSON';
import {UsersResult} from '../interfaces/Users/UsersResult';

const {ObjectAsString} = utils;

export const getAllUsers = async (): Promise<UsersResult> => {
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
export const getUserById = async (userId: string): Promise<UsersResult>  => {
    let result: UsersResult = {
        success: false,
        message: ''
    };

    const user: User = await find(userId);

    if (user) {
        result = {
            ...result,
            success: true,
            message: ObjectAsString(user)
        };
    }

    return result;
}

// POST api/users
export const createNewUser = async (newUserData: string): Promise<User | {}> => {
    try {
        return create(StringAsJSON(newUserData));
    } catch (_) {
        return {};
    }
}

// PUT api/users/{userId}
export const updateUser = async (
    userId: string,
    newUserData: string
): Promise<User | null | undefined> => {
    try {
        const userToUpdate = await find(userId);

        if (userToUpdate) {
            return update(userId, StringAsJSON(newUserData));
        }
    } catch (_) {
        return null;
    }
}

// DELETE api/users/{userId}