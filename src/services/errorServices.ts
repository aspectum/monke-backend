import { Error } from '../models/errorModel';

type SaveErrorArgs = {
    name: string;
    errorSimple: string;
    errorDetailed: string;
};

export const saveError = ({ name, errorSimple, errorDetailed }: SaveErrorArgs) => {
    const newError = new Error({
        name,
        errorSimple,
        errorDetailed,
    });

    return newError.save();
};
