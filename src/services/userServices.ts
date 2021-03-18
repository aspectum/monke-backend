import bcrypt from 'bcrypt';

import { User } from '../models/userModel';
import { RegisterData, UserDocument, UserObject } from '../interfaces';
import { ObjectId } from '../types';
import { userFormatter } from '../helpers/doc2ResObj';

const saltRounds = 12;

type Credentials = {
    email: string;
    password: string;
};

// Defining user services
export default class UserServices {
    // Creating a new user
    static createUser(userData: RegisterData) {
        const { username, email, password } = userData;
        return bcrypt
            .hash(password, saltRounds)
            .then((encryptedPassword) => {
                const newUser = new User({
                    username,
                    email,
                    encryptedPassword,
                    alerts: [],
                });

                return newUser.save();
            })
            .then(userFormatter);
    }

    // Finding user by id (used by AlertServices and so doesn't need userFormatter)
    static findById(userId: string) {
        return User.findById(userId).exec();
    }

    // Login handler
    static checkCredentials(credentials: Credentials): Promise<UserObject> {
        const { email, password } = credentials;
        let foundUser: UserDocument;

        return User.find({ email })
            .exec()
            .then((users) => {
                const user = users[0];
                if (user) {
                    foundUser = user;

                    return bcrypt.compare(password, user.encryptedPassword);
                }
                throw new Error('ERROR: user does not exist'); // TODO: fix errors
            })
            .then((isValid) => {
                if (isValid) {
                    return foundUser;
                }
                throw new Error('ERROR: wrong password'); // TODO: fix errors
            })
            .then(userFormatter);
    }

    // Add alert to user (used by AlertServices and so doesn't need userFormatter)
    static addAlert(alertId: ObjectId, userId: string) {
        return User.findById(userId)
            .exec()!
            .then((user) => {
                return user!.addAlert(alertId);
            });
    }

    // Remove alert from user (used by AlertServices and so doesn't need userFormatter)
    static removeAlert(alertId: ObjectId, userId: string) {
        return User.findById(userId)
            .exec()!
            .then((user) => {
                return user!.removeAlert(alertId);
            });
    }
}
