import bcrypt from 'bcrypt';

import { User } from '../models/userModel';
import { UserData } from '../interfaces';
import { ObjectId } from '../types';

const saltRounds = 12;

type Credentials = {
    email: string;
    password: string;
};

// Defining user services
export default class UserServices {
    static createUser(userData: UserData) {
        const { username, email, password } = userData;
        return bcrypt.hash(password, saltRounds).then((encryptedPassword) => {
            const newUser = new User({
                username,
                email,
                encryptedPassword,
                alerts: [],
            });

            return newUser.save();
        });
    }

    static findById(userId: string) {
        return User.findById(userId).exec();
    }

    // login handler
    static checkCredentials(credentials: Credentials): Promise<ObjectId> {
        const { email, password } = credentials;
        let userId: ObjectId;

        return User.find({ email })
            .exec()
            .then((users) => {
                const user = users[0];
                if (user) {
                    userId = user._id;

                    return bcrypt.compare(password, user.encryptedPassword);
                }
                throw new Error('ERROR: user does not exist'); // TODO: fix errors
            })
            .then((isValid) => {
                if (isValid) {
                    return userId;
                }
                throw new Error('ERROR: wrong password'); // TODO: fix errors
            });
    }

    // add alert to user
    static addAlert(alertId: ObjectId, userId: string) {
        return User.findById(userId)
            .exec()!
            .then((user) => {
                return user!.addAlert(alertId);
            });
    }

    static removeAlert(alertId: ObjectId, userId: ObjectId) {
        return User.findById(userId)
            .exec()!
            .then((user) => {
                return user!.removeAlert(alertId);
            });
    }
}
