import { Types } from 'mongoose';
import { AlertData, AlertDocument, ProductData } from '../interfaces';
import { Alert } from '../models/alertModel';
import ProductServices from './productServices';
import UserServices from './userServices';

// Defining alert services
export default class AlertServices {
    static createAlert(alertData: AlertData, userId: string) {
        const { url, targetPrice } = alertData;
        let productData: ProductData;
        let createdAlert: AlertDocument;

        return ProductServices.scrapeUrl(url)
            .then((data) => {
                // TODO: Validate if there is an error, maybe change type to remove error if I jus decide to throw it
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
            })
            .then(() => createdAlert.populate('product').execPopulate()); // Check if added correctly?
    }

    static listUserAlerts(userId: string) {
        return UserServices.findById(userId)
            .then((user) => {
                return user!
                    .populate({
                        path: 'alerts',
                        populate: { path: 'product' },
                    })
                    .execPopulate();
            })
            .then((populatedUser) => populatedUser.alerts);
    }

    static findById(alertId: string) {
        return Alert.findById(alertId).then((alert) => {
            return alert!.populate('product').execPopulate();
        });
    }

    // TODO: populate
    static editAlert(alertId: string, targetPrice: number) {
        return Alert.findByIdAndUpdate(alertId, { targetPrice }, { new: true });
    }

    // TODO: populate
    static deleteAlert(alertId: string, userId: string) {
        let deletedAlert: AlertDocument;

        return Alert.findByIdAndDelete(alertId)
            .then((deleted) => {
                if (!deleted) {
                    throw new Error('ERROR: no such alert');
                }
                deletedAlert = deleted!;
                return UserServices.removeAlert(deletedAlert._id, userId);
            })
            .then(() => deletedAlert);
    }
}
