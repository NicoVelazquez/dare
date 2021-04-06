import config from '../config';
import jwt from 'jsonwebtoken';

const {JWT_ENCRYPTION} = process.env;
const {JWT_EXPIRATION} = config;

const getJWT = (user) => {
    const token = jwt.sign({user: user.id}, JWT_ENCRYPTION, {expiresIn: JWT_EXPIRATION});

    return {
        token,
        type: 'Bearer',
        expires_in: jwt.decode(token, JWT_ENCRYPTION).exp - Math.round(Date.now() / 1000),
    };
};

export default getJWT;
