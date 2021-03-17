import { Schema, Types } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// https://stackoverflow.com/questions/42233987/how-to-configure-custom-global-interfaces-d-ts-files-for-typescript

export interface ObjectId extends Schema.Types.ObjectId, Types.ObjectId {}

export type TokenData = {
    id: string;
    username: string;
};

export interface ExpressReq extends Request {
    authData?: TokenData;
}

export interface ExpressRes extends Response {}

export interface ExpressNext extends NextFunction {}
