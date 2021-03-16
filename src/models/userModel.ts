import { Schema, model } from 'mongoose';

import { UserDocument } from '../interfaces';

// maybe will need model interfaces later: https://stackoverflow.com/a/45675548, https://stackoverflow.com/a/64616614
// Defining the model for the users
const userSchema = new Schema<UserDocument>({
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
        required: true,
    },
});

// TODO: define type of alertId
// Defining method to add a new alert to array
userSchema.methods.addAlert = function (alertId) {
    this.alerts.push(alertId);

    return this.save();
};

// Defining method to remove an alert from array
userSchema.methods.removeAlert = function (alertId) {
    const index = this.alerts.indexOf(alertId);
    this.alerts.splice(index, 1);

    return this.save();
};

// TODO: Edit alerts, or not

export default model('User', userSchema);
