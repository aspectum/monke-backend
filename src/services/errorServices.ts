import util from 'util';
import { PossibleErrors } from '../helpers/customErrors';
import { Error } from '../models/errorModel';

type CreateNewErrorArgs = {
    name: string;
    errorSimple: string;
    errorDetailed: string;
};

// Save error to DB
const createNewError = ({ name, errorSimple, errorDetailed }: CreateNewErrorArgs) => {
    const newError = new Error({
        name,
        errorSimple,
        errorDetailed,
    });

    return newError.save();
};

// Helper function to simplify call
export const saveError = (err: PossibleErrors) => {
    return createNewError({
        name: err.name,
        errorSimple: util.inspect(err, false, null, true),
        errorDetailed: util.inspect(err, true, null, true),
    });
};
