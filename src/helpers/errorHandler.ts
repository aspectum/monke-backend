/* eslint-disable no-console */
import chalk from 'chalk';
import { GraphQLError } from 'graphql';
import { ExpressNext, ExpressReq, ExpressRes } from '../types';

// TODO: better error handling
// Example
// if (err.name === 'MongoError' && err.code === 1000 && Object.keys(err.keyPattern).includes('email')) customError.msg(email already exists)

const errorParser = (err: Error | GraphQLError) => {
    console.log('---------NEW ERROR----------');
    console.log(chalk.bgRed(err.name));
    console.log(chalk.bgRed(err.message));
    console.log(chalk.bgRed(err.stack));
    console.log(Object.getOwnPropertyNames(err));

    let name: string;

    // const t = typeof err

    if ('originalError' in err) {
        name = err.originalError!.name;
    } else {
        name = err.name;
    }

    return {
        name,
        message: err.message,
    };
};

export const errorMiddleware = (
    err: Error,
    req: ExpressReq,
    res: ExpressRes,
    next: ExpressNext
) => {
    return res.status(500).send({ errors: [errorParser(err)] });
};

export const formatError = (err: Error) => {
    return errorParser(err);
};
