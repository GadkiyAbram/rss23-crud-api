import {User, Users} from '../interfaces/User';
import {users} from '../data/users';
import {BaseUser} from '../interfaces/BaseUser';
import {v4 as uuidV4} from 'uuid';

export const findAll = async (): Promise<User[]> => Object.values(users);

export const find = async (id: string): Promise<User> => users[id];

export const create = async (newUser: BaseUser) : Promise<User> => {
    const id: string = uuidV4();

    users[id] = {
        id,
        ...newUser
    };

    return users[id];
}

export const update = async (
    id: string,
    userUpdated: BaseUser
    ): Promise<User | null> => {
    const user = await find(id);

    if (!user) {
        return null;
    }

    users[id] = { id, ...userUpdated};

    return users[id];
}

export const remove = async (id: string): Promise<null | void> => {
    const user = await find(id);

    if (!user) {
        return null;
    }

    delete users[id];
}