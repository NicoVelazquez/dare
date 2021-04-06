import development from './env/development';
import production from './env/production';
import testing from './env/testing';

const getEnvConfig = () => {
    switch (process.env.NODE_ENV) {
        case 'production':
            return production;
        case 'testing':
            return testing;
        default:
            return development;
    }
};

const envConfig = getEnvConfig();

export default envConfig;
