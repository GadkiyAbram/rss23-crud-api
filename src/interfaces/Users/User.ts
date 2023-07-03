import {BaseUser} from './BaseUser.ts';

export interface User extends BaseUser {
    id: string;
}

export interface Users {
    [key: string]: User
}