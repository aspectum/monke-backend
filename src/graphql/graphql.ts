import { graphqlHTTP } from 'express-graphql';
import schema from './schema';
import * as resolvers from './resolvers';

// TODO: format error
export default graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: process.env.NODE_ENV === 'development',
});
