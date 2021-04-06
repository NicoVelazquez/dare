import express from 'express';
import asyncHandler from 'express-async-handler';
import validate from '../middleware/validate';
import {isAuthorized} from '../middleware/auth';
import {clientsValidation} from '../validators';
import {clientsController} from '../controllers';

const clientsRouter = express.Router();

clientsRouter.get('/', isAuthorized, validate(clientsValidation.getClientsValidation),
    asyncHandler(async (req, res, next) => {
        await clientsController.getClients(req, res, next)
    })
);

clientsRouter.get('/:id', isAuthorized, validate(clientsValidation.getClientValidation),
    asyncHandler(async (req, res, next) => {
        await clientsController.getClient(req, res, next)
    })
);

clientsRouter.get('/:id/policies', isAuthorized, validate(clientsValidation.getClientValidation),
    asyncHandler(async (req, res, next) => {
        await clientsController.getClientPolicies(req, res, next)
    })
);

export default clientsRouter;
