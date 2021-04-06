import _ from 'lodash';
import { userRolesEnums } from '../middleware/enum/users';
import { findPoliciesByFilter } from '../services/policies';
import { findAllClientsDetails, findClientDetails, findClientByFilter } from '../services/clients';

export const getClients = async (req, res) => {
    const { query, user } = req;
    let clients;
    if (user.role === userRolesEnums[userRolesEnums.user]) {
        const client = await findClientDetails(user);
        clients = [client];
    } else clients = await findAllClientsDetails(query);

    return res.status(200).json(clients);
};

export const getClient = async (req, res) => {
    const {
        user,
        params: { id: clientId },
    } = req;
    let clientDetails;

    if (user.role === userRolesEnums[userRolesEnums.user] && user.id !== clientId) {
        const responseMessage = {
            success: false,
            message: 'Unauthorized',
            code: 401
        };
        return res.status(401).json(responseMessage);
    }

    if (user.role === userRolesEnums[userRolesEnums.admin]) {
        const client = await findClientByFilter({ field: 'id', value: clientId });
        clientDetails = await findClientDetails(client);
    } else {
        clientDetails = await findClientDetails(user);
    }

    return res.status(200).json(clientDetails);
};

export const getClientPolicies = async (req, res) => {
    const {
        user,
        params: { id: clientId },
    } = req;

    if (user.role === userRolesEnums[userRolesEnums.user] && user.id !== clientId) {
        const responseMessage = {
            success: false,
            message: 'Unauthorized',
            code: 401
        };
        return res.status(401).json(responseMessage);
    }
    const policies = await findPoliciesByFilter({
        field: 'clientId',
        value: clientId,
    });

    if (_.isEmpty(policies)) {
        const responseMessage = {
            success: false,
            message: 'Not found',
            code: 404
        };
        return res.status(404).json(responseMessage);
    }

    return res.status(200).json(policies);
};
