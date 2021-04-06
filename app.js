import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes'
import undefinedRequestHandler from "./middleware/undefinedRequestHandler";
import errorHandler from "./middleware/errorHandler";

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
app.use(cors('*'));
app.use(cookieParser());
app.use('/api', router);

app.use(undefinedRequestHandler);
app.use(errorHandler);

module.exports = app;
