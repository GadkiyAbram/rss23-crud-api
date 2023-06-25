import {BaseUser} from './BaseUser';

export interface User extends BaseUser {
    id: string;
}

export interface Users {
    [key: string]: User
}