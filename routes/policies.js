import express from 'express';
import asyncHandler from 'express-async-handler';
import validate from '../middleware/validate'
import {isAuthorized} from "../middleware/auth";
import {policiesValidation} from '../validators';
import {policiesController} from '../controllers';

const policiesRouter = express.Router();

policiesRouter.get('/', isAuthorized, validate(policiesValidation.getPoliciesValidation),
    asyncHandler(async (req, res, next) => {
        await policiesController.getPolicies(req, res, next)
    })
);
policiesRouter.get('/:id', isAuthorized, validate(policiesValidation.getPolicyValidation),
    asyncHandler(async (req, res, next) => {
        await policiesController.getPolicy(req, res, next)
    })
);

export default policiesRouter;
