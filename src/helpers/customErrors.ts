/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/lines-between-class-members */
import { RawProductData } from '../interfaces';

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
        super(`There is no alert id:${alertId}`);
        this.name = 'AlertDoesNotExistError';
        this.alertId = alertId;
    }
}

export class AlertWrongUserError extends CustomError {
    alertId;
    userId;

    constructor(alertId: string, userId: string) {
        super(`Alert id:${alertId} doesn't belong to user id:${userId}`);
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
        super(`Incorrect credentials for user email:${email}`);
        this.name = 'UserWrongCredentialsError';
        this.email = email;
    }
}

export class ScrapingError extends CustomError {
    url;

    constructor(url: string) {
        super(`Could not scrape url ${url}`);
        this.name = 'ScrapingError';
        this.url = url;
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
