import createError from 'node:http'
import express from 'express';
import cookieParser from 'cookieParser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "frontendapp.vercel.app"]
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;
