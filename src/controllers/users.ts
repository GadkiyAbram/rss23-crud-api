// GET api/users
import {User, Users} from '../interfaces/Users/User.js';
import {create, find, findAll, remove, update} from '../services/Users/Users.js';
import utils from '../utils/index.js';
import {stringAsJSON} from '../utils/stringAsJSON.js';
import {UsersResult} from '../interfaces/Users/UsersResult.js';
import {userRequiredFields} from '../interfaces/Users/BaseUser.js';

const {
    objectAsString,
    checkRequiredFields
} = utils;

export const getAllUsers = async (): Promise<UsersResult> => {
    try {
        const result: User[] = await findAll() || [];

        return {
            success: true,
            message: objectAsString(result)
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
            message: objectAsString(user)
        };
    }

    return result;
}

// POST api/users
export const createNewUser = async (newUserData: string): Promise<User | {}> => {
    try {
        const newUser = stringAsJSON(newUserData);

        const allRequiredFieldsSettled = checkRequiredFields(userRequiredFields, Object.keys(newUser));

        if (!allRequiredFieldsSettled) {
            return {}
        }

        return create(stringAsJSON(newUserData));
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
            return update(userId, stringAsJSON(newUserData));
        }
    } catch (e) {
        console.log(e);
        return null;
    }
}

export const deleteUser = async (userId: string): Promise<boolean | null> => {
    try {
        return await remove(userId);
    } catch (_) {
        return null;
    }
}

// DELETE api/users/{userId}