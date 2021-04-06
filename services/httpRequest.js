import axios from 'axios';
import {getExpirationTime} from '../helpers/utils';
import dataCache from './cache';

const {
    INSURANCE_API_CLIENT_ID,
    INSURANCE_API_CLIENT_SECRET,
    INSURANCE_API_BASE_URL,
} = process.env;

export const httpPostJson = (url, body, requestHeaders) =>
    new Promise((resolve, reject) => {

        const headers = {
            'Content-Type': 'application/json',
            ...requestHeaders,
        };

        axios
            .post(url, body, {headers})
            .then((response) => {
                let resBody = response.data;
                if (typeof response.data === 'string') resBody = JSON.parse(response.data);
                const httpResponse = {};
                if (response.statusCode >= 400) httpResponse.failure = resBody;
                else httpResponse.success = resBody;
                httpResponse.headers = response.headers || {};
                return resolve({...httpResponse, statusCode: response.statusCode});
            })
            .catch((error) => {
                return reject(error);
            });
    });

export const httpGet = (url, requestHeaders) =>
    new Promise((resolve, reject) => {

        const headers = {
            'Content-Type': 'application/json',
            ...requestHeaders,
        };

        axios
            .get(url, {headers})
            .then((response) => {
                let resBody = response.data;
                if (typeof response.data === 'string') resBody = JSON.parse(response.data);

                const httpResponse = {};
                if (response.statusCode >= 400) httpResponse.failure = resBody || 'Authentication Error';
                else httpResponse.success = resBody;
                httpResponse.headers = response.headers || {};
                return resolve({...httpResponse, statusCode: response.statusCode});
            })
            .catch((error) => {
                return reject(error);
            });
    });

export const getAuthToken = async (cacheToken = true) => {
    if (dataCache.get('authToken')) return dataCache.get('authToken');
    const {success = {}, failure} = await httpPostJson(`${INSURANCE_API_BASE_URL}/login`, {
        client_id: INSURANCE_API_CLIENT_ID,
        client_secret: INSURANCE_API_CLIENT_SECRET,
    });
    if (failure) throw new Error(failure.message || failure);
    if (!success.token || !success.type) {
        throw new Error('no token found');
    }

    if (cacheToken) dataCache.set('authToken', {...success});
    return success;
};

export const getDataFromAPI = async (path, {cache = true, repository}) => {
    const {token, type} = await getAuthToken();
    const {success, failure, headers, statusCode} = await httpGet(
        `${INSURANCE_API_BASE_URL}/${path}`,
        {
            Authorization: `${type} ${token}`,
        }
    );

    if (failure) {
        if (statusCode === 401 && failure.message === 'Authorization token expired') {
            repository.del('authToken');
            return getDataFromAPI(path, {cache, repository});
        }
        throw new Error(failure.message || failure);
    }
    if (!success) throw new Error(`${path} not found`);
    if (cache) repository.set(path, success, getExpirationTime(headers));
    return success;
};
