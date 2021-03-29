import { ErrorData } from '../interfaces';
import { Error } from '../models/errorModel';

export const saveError = (errorData: ErrorData) => {
    const newError = new Error({
        name: errorData.name,
        errorObj: errorData,
    });

    return newError.save();
};
