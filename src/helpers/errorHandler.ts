import chalk from 'chalk';
import { saveError } from '../services/errorServices';
import { ExpressNext, ExpressReq, ExpressRes } from '../types';
import { PossibleErrors } from './customErrors';

type ErrorResponseObject = {
    name: string;
    message: string;
};

// Console logs the error
const errorLogger = (
    error: ErrorResponseObject,
    stack: string | undefined,
    anticipatedError: boolean
) => {
    if (
        anticipatedError === false ||
        (anticipatedError === true && process.env.MONKE_DEBUG === 'true')
    ) {
        console.log('---------NEW ERROR----------');
        console.log(chalk.bgRed(error.name));
        console.log(chalk.bgRed(error.message));
        console.log(chalk.bgRed(stack));
        // console.log(Object.getOwnPropertyNames(error));
    }
};

// Parses the received error to standardize output format
const errorParser = (err: PossibleErrors) => {
    const error: ErrorResponseObject = {
        name: err.name,
        message: err.message,
    };
    let anticipatedError = false;

    // CustomError thrown by auth Express middleware
    if ('customError' in err && err.customError) {
        anticipatedError = true;
    }

    // If error was throw by graphql
    if ('originalError' in err && err.originalError) {
        error.name = err.originalError.name;
        if (err.originalError.customError) {
            anticipatedError = true;
        }
    }
    // If error was thrown by mongoDB
    else if (err.name === 'MongoError' && 'code' in err) {
        if (err.code === 11000) {
            if (Object.keys(err.keyValue).includes('email')) {
                error.name = 'EmailAlreadyExistsError';
                error.message = `There is already a user with the email ${err.keyValue.email}`;
                anticipatedError = true;
            }
            if (Object.keys(err.keyValue).includes('username')) {
                error.name = 'UsernameAlreadyExistsError';
                error.message = `There is already a user with the username ${err.keyValue.username}`;
                anticipatedError = true;
            }
        }
    }
    // if error was thrown by jsonwebtoken
    else if (err.name === 'TokenExpiredError') {
        error.name = 'TokenExpiredError';
        error.message = `Token expired, please log in again`;
        anticipatedError = true;
    } else if (err.name === 'JsonWebTokenError') {
        error.name = 'JsonWebTokenError';
        error.message = `Invalid Token`;
        anticipatedError = true;
    }

    errorLogger(error, err.stack, anticipatedError);
    if (anticipatedError) {
        return error;
    }

    // Saving unexpected error to DB for later
    saveError(err);
    console.log(`Unexpected error saved to DB ${chalk.red(err.name)}`);

    return {
        name: 'UnexpectedError',
        message: `An unexpected error occurred. We are working on solving it. Meanwhile, try that operation again.`,
    };
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
