/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { GraphQLError } from 'graphql';
import { ProductDocument, RawProductData } from '../interfaces';

// ------------------------------------------
// --------------- Typescript ---------------
// ------------------------------------------

// For some reason keyValue wasn't showing up in default MongoError
interface CustomMongoError extends Error {
    code: number;
    keyValue: {
        email?: string;
        username?: string;
    };
}

// Accounting for customErrors
interface OriginalError extends Error {
    customError?: boolean;
}
interface CustomGQLError extends GraphQLError {
    originalError: OriginalError;
}

export type PossibleErrors = Error | CustomGQLError | CustomMongoError | OriginalError;

// ---------------------------------------------
// --------------- Custom Errors ---------------
// ---------------------------------------------

class CustomError extends Error {
    customError;

    constructor(message: string) {
        super(message);
        this.customError = true;
    }
}

export class AlertDoesNotExistError extends CustomError {
    alertId;

    constructor(alertId: string) {
        super(`There is no alert id: ${alertId}`);
        this.name = 'AlertDoesNotExistError';
        this.alertId = alertId;
    }
}

export class AlertWrongUserError extends CustomError {
    alertId;
    userId;

    constructor(alertId: string, userId: string) {
        super(`Alert id: ${alertId} doesn't belong to user id: ${userId}`);
        this.name = 'AlertWrongUserError';
        this.alertId = alertId;
        this.userId = userId;
    }
}

export class UserDoesNotExistError extends CustomError {
    email;

    constructor(email: string) {
        super(`There is no user with email ${email}`);
        this.name = 'UserDoesNotExistError';
        this.email = email;
    }
}

export class UserWrongCredentialsError extends CustomError {
    email;

    constructor(email: string) {
        super(`Incorrect credentials for user email: ${email}`);
        this.name = 'UserWrongCredentialsError';
        this.email = email;
    }
}

export class ScrapingError extends CustomError {
    url;
    err;

    constructor(url: string, err: Error) {
        super(`Could not scrape url ${url}. Are you sure it's a valid Amazon Kindle Store url?`);
        this.name = 'ScrapingError';
        this.url = url;
        this.err = err;
    }
}

export class ProductValidationError extends CustomError {
    scrapedData;

    constructor(scrapedData: RawProductData) {
        super(`Could not validate product`);
        this.name = 'ProductValidationError';
        this.scrapedData = scrapedData;
    }
}

export class NoAuthorizationHeaderError extends CustomError {
    constructor() {
        super(`No authorization header`);
        this.name = 'NoAuthorizationHeaderError';
    }
}

export class UpdateAllProductsError extends CustomError {
    failures;

    constructor(failures: ProductDocument[]) {
        super(`Failed to update all products`);
        this.name = 'UpdateAllProductsError';
        this.failures = failures;
    }
}
