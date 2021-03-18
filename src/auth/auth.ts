import jwt from 'jsonwebtoken';

import UserServices from '../services/userServices';
import { ExpressNext, ExpressReq, ExpressRes, TokenData } from '../types';

const secret = process.env.JWT_SECRET!;

export const login = (req: ExpressReq, res: ExpressRes, next: ExpressNext): void => {
    const { email, password } = req.body;

    UserServices.checkCredentials({ email, password })
        .then((user) => {
            if (user) {
                return jwt.sign(user, secret, { expiresIn: '1h' });
            }
            throw new Error('Invalid credentials');
        })
        .then((token) => {
            return res.status(200).send({ token }); // TODO: better message
        })
        .catch(next);
};

export const register = (req: ExpressReq, res: ExpressRes, next: ExpressNext): void => {
    const { username, email, password } = req.body;
    UserServices.createUser({ username, email, password })
        .then((user) => {
            return res.status(201).send(user);
        })
        .catch(next);
};

export const checkToken = (req: ExpressReq, res: ExpressRes, next: ExpressNext): ExpressRes => {
    return res.status(200).send({ id: req.authData!.id });
};

export const authMiddleware = (req: ExpressReq, res: ExpressRes, next: ExpressNext): void => {
    const { authorization } = req.headers;

    if (!authorization) {
        return next(new Error('ERROR: no authorization header')); // TODO: improve error passing
    }

    const token = authorization.split(' ')[1]; // Extracting token from 'Bearer XXXXX'

    const tokenData = jwt.verify(token, secret) as TokenData; // Will throw error if fails // TODO: check error name in error middleware https://www.npmjs.com/package/jsonwebtoken#errors--codes

    req.authData = tokenData;

    return next();
};
