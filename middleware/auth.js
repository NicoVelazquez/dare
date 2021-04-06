import passport from 'passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {findUserById} from '../services/users';
import {userRolesEnums} from './enum/users';

const {JWT_ENCRYPTION} = process.env;
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_ENCRYPTION,
};

passport.use('jwt', new Strategy(opts, async (jwtPayload, callback) => {
    try {
        const user = await findUserById(jwtPayload.user);
        callback(null, user);
    } catch (error) {
        callback(error);
    }
}));

const authenticate = (request, response, callback, next) => {
    passport.authenticate('jwt', {session: false},
        async (error, user) => {
            if (error) next(error);
            if (user) {
                request.user = user;
                request.role = user.role;
                return callback(user);
            }
            const responseMessage = {
                success: false,
                message: 'Unauthorized',
                code: 401
            };
            return response.status(401).json(responseMessage)
        }
    )(request, response, next);
};

export const isAuthorized = (request, response, next) => {
    authenticate(
        request,
        response,
        () => {
            next();
        },
        next
    );
};
