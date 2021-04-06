import express from 'express';
import asyncHandler from 'express-async-handler';
import validate from "../middleware/validate";
import {userController as userLogin} from '../controllers';
import {usersValidation as loginValidation} from '../validators/index';

const usersRouter = express.Router();

usersRouter.post('/login', validate(loginValidation),
    asyncHandler(async (req, res, next) => {
        await userLogin(req, res, next)
    })
);

export default usersRouter;
