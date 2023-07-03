import {describe} from 'node:test';
import request from 'supertest';
import {Server} from '../servers/server.ts';
import {stringAsJSON} from '../utils/stringAsJSON.ts';
import {errors} from '../constants';

const TEST_PORT = 5000;

let testServer = {};

beforeAll(async () => {
    testServer = await new Server().createServer().listen(TEST_PORT);
});


describe('should perform a set of actions on user', () => {
    it('should update a user and return a 200', async () => {
        const userId: string = '1';
        const payload = {
            'username': 'FirstUserName12u',
            'age': 35,
            'hobbies': ['moto', 'cars']
        }

        const result = await request(testServer)
            .put(`/api/users/${userId}`)
            .send(payload);

        expect(result.statusCode).toBe(200);
    });

    it('should not found user and return a 404', async () => {
        const userId: string = '3';

        const result = await request(testServer).get(`/api/users/${userId}`);

        expect(result.text).toBe(errors.USER_NOT_FOUND);
        expect(result.statusCode).toBe(404);
    });

    it('should indicate bad data and return a 400', async () => {
        const userId: string = '/%^&*#123';

        const result = await request(testServer).get(`/api/users/${userId}`);

        expect(result.text).toBe(errors.INVALID_USER_ID);
        expect(result.statusCode).toBe(400);
    });

    it('should delete a user and return a 404', async () => {
        const userId: string = '1';

        const result = await request(testServer).delete(`/api/users/${userId}`);
        expect(result.statusCode).toBe(204);
    });

    it('should not find a user return a 404', async () => {
        const userId: string = '4';

        const result = await request(testServer).delete(`/api/users/${userId}`);

        expect(result.text).toBe(errors.USER_NOT_FOUND);
        expect(result.statusCode).toBe(404);
    });

    it('should not update a user and return a 404', async () => {
        const userId: string = '1';
        const payload = {
            'username': 'FirstUserName12u',
            'age': 35,
            'hobbies': ['moto', 'cars']
        }

        const result = await request(testServer)
            .put(`/api/users/${userId}`)
            .send(payload);

        expect(result.statusCode).toBe(404);
    });

    it('should create a new user and return a 200', async () => {
        const payload = {
            'username': 'NewUserCreated',
            'age': 37,
            'hobbies': ['all', 'strange people']
        }

        const result = await request(testServer)
            .post(`/api/users`)
            .send(payload);

        const newUserNameFromResult = stringAsJSON(result?.text)?.username;

        expect(newUserNameFromResult).toBe(payload.username);
        expect(result.statusCode).toBe(201);
    });

    it('should create, update, delete a new user', async () => {
        const payloadCreate = {
            'username': 'TheMostNewUser',
            'age': 30,
            'hobbies': ['meow', 'gav', 'pass', 'move']
        }

        const newUser = await request(testServer)
            .post(`/api/users`)
            .send(payloadCreate);

        const {
            id: newId,
            username: newUserName,
            age: newAge,
            hobbies: newHobbies
        } = stringAsJSON(newUser?.text);

        expect(newUserName).toBe(payloadCreate.username);
        expect(newAge).toBe(payloadCreate.age);
        expect(newUser.statusCode).toBe(201);

        const payloadUpdated = {
            ...payloadCreate,
            username: 'TheMostNewUserUpdated',
            hobbies: ['meow-meow', 'gav-gav']
        }

        const updatedUser = await request(testServer)
            .put(`/api/users/${newId}`)
            .send(payloadUpdated);

        const {
            id: updatedId,
            username: updatedUserName,
            age: updatedAge,
            hobbies: updatedHobbies
        } = stringAsJSON(updatedUser?.text);

        expect(updatedUserName).not.toBe(!payloadCreate.username);
        expect(updatedAge).toBe(payloadCreate.age);
        expect(updatedHobbies.length).not.toBe(payloadCreate.hobbies);
        expect(updatedUser.statusCode).toBe(200);
    });
});
