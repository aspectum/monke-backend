import { model, Schema } from 'mongoose';
import { ErrorDocument, ErrorModel } from '../interfaces';

// Defining the model for the errors
const errorSchema = new Schema<ErrorDocument, ErrorModel>(
    {
        name: {
            type: String,
            required: true,
        },
        errorObj: {
            type: Object,
            required: true,
        },
    },
    { timestamps: true }
);

export const Error = model<ErrorDocument, ErrorModel>('Error', errorSchema);
