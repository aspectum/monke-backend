import { Types } from 'mongoose';
import { AlertDoesNotExistError, AlertWrongUserError } from '../helpers/customErrors';
import { alertFormatter } from '../helpers/doc2ResObj';
import { AlertData, AlertDocument, ProductData, UserDocument } from '../interfaces';
import { Alert } from '../models/alertModel';
import { Populated } from '../types';
import ProductServices from './productServices';
import UserServices from './userServices';

type PopulatedAlert = Populated<AlertDocument, 'product'>;

const validateAlert = (alert: AlertDocument | null, alertId: string, userId: string) => {
    if (alert) {
        if (alert.user.equals(userId)) {
            return alert; // .populate('product').execPopulate() as Promise<PopulatedAlert>;
        }
        throw new AlertWrongUserError(alertId, userId);
    }
    throw new AlertDoesNotExistError(alertId);
};

// Defining alert services
export default class AlertServices {
    // Scrapes page given by client, creates product if it doesn't exist, create the alert and add it to user
    static createAlert(alertData: AlertData, userId: string) {
        const { url, targetPrice } = alertData;
        let productData: ProductData;
        let createdAlert: AlertDocument;

        return ProductServices.scrapeUrl(url)
            .then((data) => {
                productData = data;

                return ProductServices.findProductByASIN(productData.ASIN);
            })
            .then((product) => {
                // Check if product is already in DB
                if (!product) {
                    // Maybe this should be something else
                    return ProductServices.createProduct(productData);
                }
                return product;
            })
            .then((product) => {
                const newAlert = new Alert({
                    product: product._id,
                    targetPrice,
                    user: Types.ObjectId(userId),
                });

                return newAlert.save();
            })
            .then((alert) => {
                createdAlert = alert;
                return UserServices.addAlert(alert._id, userId);
            }) // TODO: Check if added correctly?
            .then(() => {
                return createdAlert.populate('product').execPopulate() as Promise<PopulatedAlert>;
            })
            .then(alertFormatter);
    }

    // Finds user and return their alerts
    static listUserAlerts(userId: string) {
        return UserServices.findById(userId)
            .then((user) => {
                return user!
                    .populate({
                        path: 'alerts',
                        populate: { path: 'product' },
                    })
                    .execPopulate() as Promise<Populated<UserDocument, 'alerts'>>;
            })
            .then((populatedUser) => populatedUser.alerts as PopulatedAlert[])
            .then((populatedAlerts) => populatedAlerts.map(alertFormatter));
    }

    // Finds an alert by it's id
    static findById(alertId: string, userId: string) {
        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId))
            .then((alert) => {
                return alert.populate('product').execPopulate() as Promise<PopulatedAlert>;
            })
            .then(alertFormatter);
    }

    // Edits an alert
    static editAlert(alertId: string, targetPrice: number, userId: string) {
        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId))
            .then((alert) => {
                alert.targetPrice = targetPrice;
                return alert.save();
            })
            .then((alert) => {
                return alert.populate('product').execPopulate() as Promise<PopulatedAlert>;
            })
            .then(alertFormatter);
    }

    // Deletes an alert
    static deleteAlert(alertId: string, userId: string) {
        let deletedAlert: AlertDocument;

        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId))
            .then((alert) => {
                return alert.deleteOne();
            })
            .then((alert) => {
                deletedAlert = alert;
                return UserServices.removeAlert(deletedAlert._id, userId);
            })
            .then(() => {
                return deletedAlert.populate('product').execPopulate() as Promise<PopulatedAlert>;
            })
            .then(alertFormatter);
    }
}
