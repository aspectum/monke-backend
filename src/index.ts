import express from 'express';
import mongoose from 'mongoose';

import dbConfig from './config/db';
import graphql from './graphql/graphql';

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/graphql', graphql);

mongoose.connect(dbConfig.uri, dbConfig.options);

const db = mongoose.connection;
db.on('error', () => {
    throw new Error('unable to connect to database');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
