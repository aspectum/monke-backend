import express from 'express';

import graphql from './graphql/graphql';

// console.log('test');
// console.log(process.env.MONGO_URI);
// console.log(process.env.NODE_ENV);

const PORT = process.env.PORT || 5000;

const app = express();

app.use('/graphql', graphql);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
