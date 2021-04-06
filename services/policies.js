import _ from 'lodash';
import policiesRepository from './cache';
import {getDataFromAPI} from './httpRequest';
import { PoliciesError } from '../middleware/errors';

const getPolicies = async () => {
    if (policiesRepository.has('policies')) {
        return policiesRepository.get('policies');
    }
    return getDataFromAPI('policies', {
        cache: true,
        repository: policiesRepository,
    });
};

const filterPolicies = (policies, {field, value}) =>
    _.filter(policies, (policy) => policy[field] === value);

const findPolicyByFilter = (policies, {field, value}) => {
    const policy = _.find(policies, (p) => p[field] === value);
    if (!policy) throw new PoliciesError('Not found', 404);
    return policy;
};

export const findPoliciesByFilter = async (filter) => {
    const policies = await getPolicies();
    return filterPolicies(policies, filter);
};

export const findAllPolicies = async ({limit = 10} = {}) => {
    const policies = await getPolicies();
    return _(policies).take(limit).value();
};

export const findPolicy = async (filter) => {
    const policies = await getPolicies();
    return findPolicyByFilter(policies, filter);
};
