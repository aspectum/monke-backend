// Takes in a mongoose document and returns an object stripped down of mongoose properties and formatted to response

import {
    AlertDocument,
    AlertObject,
    ProductDocument,
    ProductObject,
    UserDocument,
    UserObject,
} from '../interfaces';
import { Populated } from '../types';

const productFormatter = (productDoc: ProductDocument) => {
    return {
        ASIN: productDoc._id,
        url: productDoc.url,
        title: productDoc.title,
        imageUrl: productDoc.imageUrl,
        currency: productDoc.currency,
        priceHistory: productDoc.priceHistory,
    } as ProductObject;
};

export const alertFormatter = (alertDoc: Populated<AlertDocument, 'product'>) => {
    return {
        id: alertDoc._id.toString(),
        product: productFormatter(alertDoc.product),
        targetPrice: alertDoc.targetPrice,
        createdAt: alertDoc.createdAt.toISOString(),
        updatedAt: alertDoc.updatedAt.toISOString(),
    } as AlertObject;
};

export const userFormatter = (userDoc: UserDocument) => {
    return {
        id: userDoc._id.toString(),
        username: userDoc.username,
        email: userDoc.email,
    } as UserObject;
};
