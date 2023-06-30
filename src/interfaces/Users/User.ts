import {BaseUser} from './BaseUser.js';

export interface User extends BaseUser {
    id: string;
}

export interface Users {
    [key: string]: User
}