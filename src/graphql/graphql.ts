import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import * as resolvers from './resolvers';
import { formatError } from '../helpers/errorHandler';

export default graphqlHTTP({
    schema,
    rootValue: resolvers,
    customFormatErrorFn: formatError,
});
