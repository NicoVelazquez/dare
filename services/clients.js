import _ from 'lodash';
import clientRepository from './cache';
import {getDataFromAPI} from './httpRequest';
import {findPoliciesByFilter} from './policies';
import { ClientsError } from '../middleware/errors';

const findClient = (clients, {field, value}) => {
    const client = _.find(clients, (c) => c[field] === value);
    if (!client) throw new ClientsError('Not found', 404);
    return client;
};

const getClients = async () => {
    if (clientRepository.has('clients')) {
        return clientRepository.get('clients');
    }
    return getDataFromAPI('clients', {
        cache: true,
        repository: clientRepository,
    });
};

export const findClientByFilter = async (filter) => {
    const clients = await getClients();
    return findClient(clients, filter);
};

export const findClientDetails = async (client) => {
    const clientPolicies = await findPoliciesByFilter({
        field: 'clientId',
        value: client.id,
    });
    return {...client, policies: clientPolicies};
};

export const findAllClientsDetails = async ({limit = 10, page = 1, name} = {}) => {
    const clients = await getClients();
    if (name) {
        return findClientByFilter({field: 'name', value: name});
    }

    const result = _(clients)
        .orderBy(['name'], ['asc'])
        .drop((page - 1) * limit)
        .take(limit)
        .value();

    return await Promise.all(result.map((client) => findClientDetails(client)));
};
