import {User, Users} from '../../interfaces/Users/User.ts';
import {users} from '../../data/users.ts';
import {BaseUser} from '../../interfaces/Users/BaseUser.ts';
import {v4 as uuidV4} from 'uuid';

export const findAll = async (): Promise<User[]> => Object.values(users);

export const find = async (id: string): Promise<User> => users[id];

export const create = async (newUser: BaseUser) : Promise<User> => {
    const id: string = uuidV4();

    users[id] = {
        id,
        ...newUser
    };

    return await find(id);
}

export const update = async (id: string, userUpdated: BaseUser): Promise<User | null> => {
    users[id] = {id, ...userUpdated};

    return find(id);
}

export const remove = async (id: string): Promise<null | boolean> => {
    const user = await find(id);

    if (!user) {
        return null;
    }

    return delete users[id];
}