import {findUserByName, compareUserPassword} from '../services/users';
import getJWT from '../services/auth';

const login = async (req, res) => {
    const {
        body: {username, password},
    } = req;

    const user = await findUserByName(username);

    if (!compareUserPassword(user, password)) {
        const response = {
            success: false,
            message: 'Incorrect username/password combination.',
            code: 400,
        };
        return res.status(400).json(response);
    }
    const result = getJWT(user);
    return res.status(200).json(result);
};

export default login;
