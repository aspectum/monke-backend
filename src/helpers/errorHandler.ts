import chalk from 'chalk';
import { ExpressNext, ExpressReq, ExpressRes } from '../types';

// TODO: better error handling
// Example
// if (err.name === 'MongoError' && err.code === 1000 && Object.keys(err.keyPattern).includes('email')) customError.msg(email already exists)

const errorParser = (err: Error) => {
    console.log('---------NEW ERROR----------');
    console.log(chalk.bgRed(err.message));
    console.log(chalk.bgRed(err.stack));
    console.log(Object.getOwnPropertyNames(err));
    return err.message;
};

export const errorMiddleware = (
    err: Error,
    req: ExpressReq,
    res: ExpressRes,
    next: ExpressNext
) => {
    return res.status(500).send({ error: errorParser(err) });
};

export const formatError = (err: Error) => {
    return { message: errorParser(err) };
};
