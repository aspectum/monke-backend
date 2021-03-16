import { Schema, model } from 'mongoose';

import { UserDocument, UserModel } from '../interfaces';
import { ObjectId } from '../types';

// maybe will need model interfaces later: https://stackoverflow.com/a/45675548, https://stackoverflow.com/a/64616614, https://medium.com/@agentwhs/complete-guide-for-typescript-for-mongoose-for-node-js-8cc0a7e470c1
// Defining the model for the users
const userSchema = new Schema<UserDocument, UserModel>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
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
        default: false,
    },
});

// TODO: define type of alertId
// Defining method to add a new alert to array
userSchema.methods.addAlert = function (alertId: ObjectId) {
    this.alerts.push(alertId);

    return this.save();
};

// Defining method to remove an alert from array
userSchema.methods.removeAlert = function (alertId: ObjectId) {
    const index = this.alerts.indexOf(alertId);
    this.alerts.splice(index, 1);

    return this.save();
};

// TODO: Edit alerts, or not

export const User = model<UserDocument, UserModel>('User', userSchema);
