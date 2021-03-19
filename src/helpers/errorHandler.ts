/* eslint-disable no-console */
import chalk from 'chalk';
import { GraphQLError } from 'graphql';
import { MongoError } from 'mongodb';
import { ExpressNext, ExpressReq, ExpressRes } from '../types';

// For some reason keyValue wasn't showing up in default MongoError
interface CustomMongoError extends MongoError {
    code: number;
    keyValue: {
        email?: string;
        username?: string;
    };
}

type PossibleErrors = Error | GraphQLError | CustomMongoError;

type ErrorResponseObject = {
    name: string;
    message: string;
};

// Console logs the error
const errorLogger = (error: ErrorResponseObject, stack?: string) => {
    console.log('---------NEW ERROR----------');
    console.log(chalk.bgRed(error.name));
    console.log(chalk.bgRed(error.message));
    console.log(chalk.bgRed(stack));
    // console.log(Object.getOwnPropertyNames(error));
};

// Parses the received error to standardize output format
const errorParser = (err: PossibleErrors) => {
    const error: ErrorResponseObject = {
        name: err.name,
        message: err.message,
    };

    // If error was throw by graphql
    if ('originalError' in err && err.originalError) {
        error.name = err.originalError.name;
    }
    // If error was thrown by mongoDB
    else if (err.name === 'MongoError' && 'code' in err) {
        if (err.code === 11000) {
            if (Object.keys(err.keyValue).includes('email')) {
                error.name = 'EmailAlreadyExists';
                error.message = `There is already a user with the email ${err.keyValue.email}`;
            }
            if (Object.keys(err.keyValue).includes('username')) {
                error.name = 'UsernameAlreadyExists';
                error.message = `There is already a user with the username ${err.keyValue.username}`;
            }
        }
    }

    errorLogger(error, err.stack);
    return error;
};

// Express error handling middleware
export const errorMiddleware = (
    err: Error,
    req: ExpressReq,
    res: ExpressRes,
    next: ExpressNext
) => {
    return res.status(500).send({ errors: [errorParser(err)] });
};

// express-graphql error formatter function
export const formatError = (err: Error) => {
    return errorParser(err);
};
