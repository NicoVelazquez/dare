import { findClientByFilter } from './clients';

export const findUserByName = (name) => findClientByFilter({ field: 'name', value: name });

export const findUserById = (id) => findClientByFilter({ field: 'id', value: id });

export const compareUserPassword = (user, password) => password === '12345678';
