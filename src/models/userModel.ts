/* eslint-disable func-names */
import { model, Schema } from 'mongoose';
import { UserDocument, UserModel } from '../interfaces';
import { ObjectId } from '../types';

// Defining the model for the users
const userSchema = new Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    encryptedPassword: {
        type: String,
        required: true,
    },
    alerts: [
        {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Alert',
        },
    ],
    activated: {
        type: Boolean,
        default: true,
    },
});

// Defining method to add a new alert to array
userSchema.methods.addAlert = function (alertId: ObjectId) {
    (this.alerts as ObjectId[]).push(alertId);

    return this.save();
};

// Defining method to remove an alert from array
userSchema.methods.removeAlert = function (alertId: ObjectId) {
    const index = (this.alerts as ObjectId[]).indexOf(alertId);
    this.alerts.splice(index, 1);

    return this.save();
};

export const User = model<UserDocument, UserModel>('User', userSchema);
