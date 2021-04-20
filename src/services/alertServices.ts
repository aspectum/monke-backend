/* eslint-disable no-process-exit */ // It will be run as a scheduled task in heroku, needs to exit
import chalk from 'chalk';
import { Types } from 'mongoose';
import { mailer } from '../config/mailer';
import { AlertDoesNotExistError, AlertWrongUserError } from '../helpers/customErrors';
import { alertFormatter } from '../helpers/doc2ResObj';
import { alertMail } from '../helpers/mailTemplates';
import {
    AlertData,
    AlertDocument,
    AlertDocumentPopulatedAll,
    AlertDocumentPopulatedProduct,
    ProductData,
    UserDocumentPopulatedAlerts,
} from '../interfaces';
import { Alert } from '../models/alertModel';
import { ObjectId } from '../types';
import ProductServices from './productServices';
import UserServices from './userServices';

// Checks if alert was found in DB and if so whether it belongs to the user requesting
const validateAlert = (alert: AlertDocument | null, alertId: string, userId: string) => {
    // If query returned an alert
    if (alert) {
        // If alert belongs to requesting user
        if ((alert.user as ObjectId).equals(userId)) {
            return alert;
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
                if (data === null) {
                    const err = new Error() as any;
                    err.name = 'DataIsNullError'; // hack
                    err.url = url;
                    throw err;
                }

                productData = data;

                return ProductServices.findProductByASIN(productData.ASIN);
            })
            .then((product) => {
                // Check if product is already in DB
                // If not, creates the product
                if (!product) {
                    return ProductServices.createProduct(productData);
                }
                return product;
            })
            .then((product) => {
                // Creating alert
                const newAlert = new Alert({
                    title: product.title,
                    product: product._id,
                    targetPrice,
                    user: Types.ObjectId(userId),
                });

                return newAlert.save();
            })
            .then((alert) => {
                // Saving alert to user document
                createdAlert = alert;
                return UserServices.addAlert(alert._id, userId);
            }) // TODO: Check if added correctly?
            .then(() => {
                return createdAlert
                    .populate('product')
                    .execPopulate() as Promise<AlertDocumentPopulatedProduct>;
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
                    .execPopulate() as Promise<UserDocumentPopulatedAlerts>;
            })
            .then((populatedUser) => populatedUser.alerts as AlertDocumentPopulatedProduct[])
            .then((populatedAlerts) => populatedAlerts.map(alertFormatter));
    }

    // Finds an alert by it's id
    static findById(alertId: string, userId: string) {
        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId))
            .then((alert) => {
                return alert
                    .populate('product')
                    .execPopulate() as Promise<AlertDocumentPopulatedProduct>;
            })
            .then(alertFormatter);
    }

    // Edits an alert
    static editAlert(alertId: string, title: string, targetPrice: number, userId: string) {
        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId))
            .then((alert) => {
                alert.set({ targetPrice });
                alert.set({ title });
                return alert.save();
            })
            .then((alert) => {
                return alert
                    .populate('product')
                    .execPopulate() as Promise<AlertDocumentPopulatedProduct>;
            })
            .then(alertFormatter);
    }

    // Deletes an alert
    static deleteAlert(alertId: string, userId: string) {
        let deletedAlert: AlertDocument;

        return Alert.findById(alertId)
            .then((alert) => validateAlert(alert, alertId, userId)) // Finding alert
            .then((alert) => {
                // Deleting alert
                return alert.deleteOne();
            })
            .then((alert) => {
                // Removing alert from user document
                deletedAlert = alert;
                return UserServices.removeAlert(deletedAlert._id, userId);
            })
            .then(() => {
                return deletedAlert
                    .populate('product')
                    .execPopulate() as Promise<AlertDocumentPopulatedProduct>;
            })
            .then(alertFormatter);
    }

    // Check if product price is below alert targetPrice
    static checkNotifyUser(alert: AlertDocument) {
        const { targetPrice } = alert;

        return (alert.populate('product').execPopulate() as Promise<AlertDocumentPopulatedProduct>)
            .then((alertWithProd) => {
                return alertWithProd
                    .populate('user')
                    .execPopulate() as Promise<AlertDocumentPopulatedAll>;
            })
            .then((alertPop) => {
                const recentPrice =
                    alertPop.product.priceHistory[alertPop.product.priceHistory.length - 1].price;
                if (recentPrice < targetPrice) {
                    console.log(
                        `Alert for ${alertPop.product.title} for user ${alertPop.user.username} fired. Target price was ${targetPrice} and found price was ${recentPrice}`
                    );

                    return mailer.sendMail({
                        to: alertPop.user.email,
                        from: 'monke.amazon.price.monitor@gmail.com',
                        subject: `monke: Price alert for ${alertPop.product.title}`,
                        html: alertMail(alertPop),
                    });
                }
                return null;
            });
    }

    // Checks every alert if user should be notified
    static checkAlerts() {
        console.log(chalk.bgCyan('Checking alerts'));
        const startTime = Date.now();
        let len: number;
        return Alert.find({})
            .exec()
            .then((alerts) => {
                len = alerts.length;
                return Promise.all(
                    alerts.map((alert) => {
                        return new Promise((resolve) => {
                            resolve(this.checkNotifyUser(alert));
                        });
                    })
                );
            })
            .then(() => {
                const timeDiff = Math.round((Date.now() - startTime) / 1000);
                console.log(chalk.yellow(`Checked ${len} alerts in ${timeDiff} seconds`));
                process.exit();
            });
    }
}
