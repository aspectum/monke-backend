import express from 'express';
import mongoose from 'mongoose';
import auth, { authMiddleware } from './auth';
import dbConfig from './config/db';
import graphql from './graphql/graphql';
import { errorMiddleware } from './helpers/errorHandler';

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use('/auth', auth);
app.use(authMiddleware);

app.use(errorMiddleware);

app.use('/graphql', graphql);

mongoose.connect(dbConfig.uri, dbConfig.options);

const db = mongoose.connection;
db.on('error', () => {
    throw new Error('Unable to connect to database');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
