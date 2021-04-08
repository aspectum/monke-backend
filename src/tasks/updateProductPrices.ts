import mongoose from 'mongoose';
import ProductServices from '../services/productServices';
import dbConfig from '../config/db';

// const dbConfig = {
//     uri: 'mongodb://localhost:27017',
//     options: {
//         dbName: 'monke',
//         user: 'root',
//         pass: 'root',
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//     },
// };

mongoose.connect(dbConfig.uri, dbConfig.options);

const db = mongoose.connection;
db.on('error', () => {
    throw new Error('Unable to connect to database');
});

ProductServices.updateAllProducts();
