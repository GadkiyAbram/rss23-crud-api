export interface BaseUser {
    username: string;
    age: number;
    hobbies: string[]
}

export const userRequiredFields: string[] = [
    'username', 'age', 'hobbies'
]

export const checkUserRequiredFields = (newUserFields: string[]) => {
    return userRequiredFields.every((field) => newUserFields.includes(field) &&
        newUserFields.every((newField) => userRequiredFields.includes(newField)));
}